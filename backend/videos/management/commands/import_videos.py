import os
import ijson

from django.core.management.base import BaseCommand
from backend.videos.models import Video
from backend.hierarchy.models import Hierarchy

PATH = "./data_store/syrianarchive.org/json/"

class Command(BaseCommand):
  help = 'synchronize videos from json files'

  def _fetch_db(self):
    videos = Video.objects.all()
    db_lookup = {}
    for item in videos:
      db_lookup[item.reference_code] = item
    return db_lookup

  def _fetch_hierarchy(self):
    hierarchy = Hierarchy.objects.all()
    hierarchy_lookup = {}
    for item in hierarchy:
      # tag = '{}:{}'.format(item.category, item.slug)
      if item.category == "sa":
        hierarchy_lookup[item.name_en] = item
    print(hierarchy_lookup)
    return hierarchy_lookup

  def _create(self, data, hierarchy):
    record = Video()
    self._update(data, record, hierarchy)

  def _update(self, data, record, hierarchy):
    # changes to ["_cid"] later
    dem = data["dem"]
    record.reference_code = dem["reference_code"]
    record.url = data["_dl"]
    if "snippet" in data and "standard" in data["snippet"]["thumbnails"]:
      record.thumbnail = data["snippet"]["thumbnails"]["standard"]["url"]
    record.graphic_content = bool(dem["graphic_content"])
    record.name_en = dem["summary_en"] or dem["online_title_en"] or "(no english title)"
    record.name_ar = dem["summary_ar"] or dem["online_title_ar"] or "()"
    record.location = dem["location"] or ""
    record.date = dem["incident_date"]
    record.time = dem["incident_time"]
    for name in dem["weapons_used"]:
      if name in hierarchy:
        print("  got weapon tag: {}".format(name))
        record.weapon_tag = hierarchy[name]
    for name in dem["collections"]:
      if name in hierarchy:
        print("  got collection tag: {}".format(name))
        record.collection_tag = hierarchy[name]
    for name in dem["type_of_violation"].keys():
      if dem["type_of_violation"][name] and name in hierarchy:
        print("  got violation tag: {}".format(name))
        record.violation_tag = hierarchy[name]
    record.status = 0
    record.save()

  def _process(self, file, db, hierarchy):
    fn = os.path.join(PATH, file)
    with open(fn, 'r') as fd:
      objects = ijson.items(fd, '')
      for list in objects:
        print('new object {}'.format(len(list)))
        if not len(list):
          return
        for row in list:
          _id = row['dem']['reference_code']
          if _id not in db:
            print("new video: {}".format(_id))
            self._create(row, hierarchy)
          else:
            print("update: {}".format(_id))
            self._update(row, db[_id], hierarchy)

  def handle(self, *args, **options):
    db = self._fetch_db()
    hierarchy = self._fetch_hierarchy()
    for file in os.listdir(PATH):
      if file[-4:] != "json":
        continue
      self._process(file, db, hierarchy)


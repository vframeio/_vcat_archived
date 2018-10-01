from django.core.management.base import BaseCommand
from backend.hierarchy.models import Hierarchy

import sys
sys.path.insert(0, '../syrian_archive_visual_guide')
import tree

class Command(BaseCommand):
  help = 'synchronize models from spreadsheet'

  def _fetch_sheet(self):
    def _cache_entire_tree(wks, el, passthru):
      lookup = passthru['lookup']
      parent = passthru['parent']
      slug = el['row'][tree.C_SLUG]
      category = el['row'][tree.C_PATH].split('/')[0]
      tag = '{}:{}'.format(category, slug)
      el['parent'] = parent
      el['slug'] = slug
      el['category'] = category
      el['tag'] = tag
      lookup[tag] = el
      return { 'lookup': lookup, 'parent': tag }

    sheet_lookup = {}
    for wks in tree.get_worksheets():
      cell_matrix = wks.get_all_values(returnas='matrix')
      tree.traverse(
        tree.generate_tree(wks, quiet=True),
        fn=_cache_entire_tree,
        arg={ 'lookup': sheet_lookup, 'parent': None }
      )
    return sheet_lookup

  def _fetch_db(self):
    hierarchy = Hierarchy.objects.all()
    db_lookup = {}
    for item in hierarchy:
      tag = "{}:{}".format(item.category, item.slug)
      db_lookup[tag] = item
    return db_lookup

  def _create(self, el, parent):
    row = el['row']
    rec = Hierarchy(
      parent = parent,
      name_en = row[tree.C_NAME],
      name_ar = row[tree.C_ARABIC_NAME],
      slug = el['slug'],
      category = el['category'],
      synonyms = row[tree.C_SYNONYMS],
    )
    rec.save()
    pass

  def _update(self, el, parent, rec):
    row = el['row']
    rec.parent = parent
    rec.name_en = row[tree.C_NAME]
    rec.name_ar = row[tree.C_ARABIC_NAME]
    rec.path = row[tree.C_PATH]
    rec.slug = el['slug']
    rec.category = el['category']
    rec.synonyms = row[tree.C_SYNONYMS]
    rec.save()
    pass

  def handle(self, *args, **options):
    sheet = self._fetch_sheet()
    db = self._fetch_db()

    # if a key is in the db but not in the sheet, delete it
    for key in db.keys():
      #if key not in sheet:
      #  print("db not in sheet: {}".format(key))
      if db[key].category != 'sa':
        db[key].delete()
      #else:
      print("db: {}".format(key))

"""
    # if a slug is in the sheet but not in the db, add/update it
    for key in sheet.keys():
      parent_key = sheet[key]['parent']
      if parent_key in db:
        parent = db[parent_key]
      else:
        parent = None # top_node
      if key not in db:
        print("sheet not in db: {}".format(key))
        self._create(sheet[key], parent)
      else:
        print("sheet: {}".format(key))
        self._update(sheet[key], parent, db[key])
"""

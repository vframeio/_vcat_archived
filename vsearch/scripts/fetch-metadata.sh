#!/bin/bash

metadata_src=./datasets/sa_approved/meta
metadata_dst=/data_store/apps/syrianarchive/metadata

for t in mediarecord mediainfo keyframe keyframe_status coco places365 sugarcube
do
    echo ""
    echo "Syncing $t"
    rm -rf $metadata_src/$t/verified/
    mkdir -p $metadata_src/$t/verified/
    rsync -avz --progress vframe:$metadata_dst/$t/verified/index.json $metadata_src/$t/verified/
done

cd ..

python manage.py migrate vsearch zero
python manage.py migrate
python manage.py loaddata document_tag
python manage.py import_metadata --unverified

#!/bin/bash

BUCKET='sa-vframe'
DATASET='sa_resnet18_verified'
MEDIARECORD_PATH="datasets/${DATASET}/mediarecord"

echo $MEDIARECORD_PATH
rm -rf $MEDIARECORD_PATH
mkdir $MEDIARECORD_PATH

scp vframe@vframe:/data_store/apps/syrianarchive/metadata/media_record/verified/index.pkl "${MEDIARECORD_PATH}/verified.pkl"
scp vframe@vframe:/data_store/apps/syrianarchive/metadata/media_record/unverified/index.pkl "${MEDIARECORD_PATH}/unverified.pkl"


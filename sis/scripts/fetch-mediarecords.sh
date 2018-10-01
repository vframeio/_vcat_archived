#!/bin/bash

BUCKET='sa-vframe'
DATASET='sa_approved'
MEDIARECORD_PATH="datasets/${DATASET}/mediarecord"

rm -rf $MEDIARECORD_PATH
mkdir $MEDIARECORD_PATH

s3cmd get s3://${BUCKET}/v1/metadata/media_record/verified/index.pkl "${MEDIARECORD_PATH}/verified.pkl"
s3cmd get s3://${BUCKET}/v1/metadata/media_record/unverified/index.pkl "${MEDIARECORD_PATH}/unverified.pkl"


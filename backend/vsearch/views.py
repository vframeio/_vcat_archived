import simplejson as json
from django.conf import settings
from django.core import serializers
from rest_framework import status, generics

from backend.vsearch.models import Document, DocumentTag, ShaLookup
from backend.lib.util import json_response

@json_response
def DocumentList(request, sha256):
    documents = Document.objects.filter(sha256=sha256)
    return [serialize(doc) for doc in documents]

@json_response
def DocumentDetail(request, sha256, tag):
    document_tag = DocumentTag.objects.get(name=tag)
    document = Document.objects.get(sha256=sha256, tag=document_tag)
    return serialize(document)

@json_response
def ShaLookupDetail(request, md5):
    sha = ShaLookup.objects.get(md5=md5)
    return serialize(sha)

def serialize(document):
    return {
        'name': document.tag.name,
        'sha256': document.sha256,
        'data': json.loads(document.data),
    }

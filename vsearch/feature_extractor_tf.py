import os
import sys
import cv2 as cv
from PIL import Image
import numpy as np

import keras.applications
from keras.preprocessing import image as keras_image
from keras.models import Model

class FeatureExtractor:
  
  def __init__(self, net='VGG16', weights='imagenet', size=None):

    print('[+] initialize: {}, weights: {}'.format(net,weights))

    if net == 'Xception':
      from keras.applications.xception import Xception
      from keras.applications.xception import preprocess_input
      self.model = Xception(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'VGG16':
      print('[+] initialize using VGG16...')
      from keras.applications.vgg16 import VGG16
      from keras.applications.vgg16 import preprocess_input
      self.model = VGG16(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'VGG19':
      from keras.applications.vgg19 import VGG19
      from keras.applications.vgg19 import preprocess_input
      self.model = VGG19(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'ResNet50':
      from keras.applications.resnet50 import ResNet50
      from keras.applications.resnet50 import preprocess_input
      self.model = ResNet50(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'InceptionV3':
      from keras.applications.inception_v3 import InceptionV3
      from keras.applications.inception_v3 import preprocess_input
      self.model = InceptionV3(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (299,299)
    elif net == 'InceptionResNetV2':
      from keras.applications.inception_resnet_v2 import InceptionResNetV2
      from keras.applications.inception_resnet_v2 import preprocess_input
      self.model = InceptionResNetV2(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (299,299)
    elif net == 'DenseNet121':
      from keras.applications.densenet import DenseNet121
      from keras.applications.densenet import preprocess_input
      self.model = DenseNet121(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'DenseNet169':
      from keras.applications.densenet import DenseNet169
      from keras.applications.densenet import preprocess_input
      self.model = DenseNet169(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'DenseNet201':
      from keras.applications.densenet import DenseNet201
      from keras.applications.densenet import preprocess_input
      self.model = DenseNet201(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'NASNetLarge':
      from keras.applications.nasnet import NASNetLarge
      from keras.applications.nasnet import preprocess_input
      self.model = NASNetLarge(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    elif net == 'NASNetMobile':
      from keras.applications.nasnet import NASNetMobile
      from keras.applications.nasnet import preprocess_input
      self.model = NASNetMobile(weights=weights, include_top=False, pooling='avg')
      self.input_size = size if size is not None else (224,224)
    else:
      print("FeatureExtractor: Net not found")

    self.preprocess_input = preprocess_input

  def extract(self, fp_im):
    #im_np = ensure_np(im)
    #im = cv.resize(im_np, self.input_size) # force resize
    #im = cv.cvtColor(im, cv.COLOR_RGBA2BGR)
    im = keras_image.load_img(fp_im, target_size=(224, 224)) # convert np.ndarray
    x = keras_image.img_to_array(im) # reshape to (3, 224, 224) 
    x = x.copy(order="C")
    #im_rgb = Image.open(fp_im)
    #im_np_rgb = ensure_np(im_rgb)
    #im_np_bgr = cv.cvtColor(im_np_rgb, cv.COLOR_RGB2BGR)
    #x = keras_image.img_to_array(im_np_bgr) # reshape to (3, 224, 224) 
    x = np.expand_dims(x, axis=0) # expand to (1, 3, 224, 224)
    #from keras.applications.vgg16 import preprocess_input as keras_preprocess
    x = self.preprocess_input(x)
    print(x.shape)
    feats = self.model.predict(x)[0] # extract features
    #feats_arr = np.char.mod('%f', features) # convert to list
    feats_norm = feats/np.linalg.norm(feats)
    return feats_norm


def ensure_pil(im):
  """Ensure image is Pillow format"""
  try:
      im.verify()
      return im
  except:
      return Image.fromarray(im.astype('uint8'), 'RGB')

def ensure_np(im):
  """Ensure image is numpy array"""
  if type(im) == np.ndarray:
      return im
  return np.asarray(im, np.uint8)


import os
from os.path import join
import cv2 as cv
import numpy as np
import xml.etree.ElementTree

class HaarSaliency:

    # Input images should be between 320x240 and 640x480
    classifiers = []
    face_matrix = []
    flags = 0
    nstages = 0

    def __init__(self, cascade):

        cdir, cname = os.path.split(cascade)
        cname, ext = os.path.splitext(cname)

        root = xml.etree.ElementTree.parse(cascade)
        #width = int(root.find('./cascade/width').text.strip())
        #height = int(root.find('./cascade/height').text.strip())
        self.nstages_total = int(root.find('./cascade/stageNum').text.strip())

        # initialize classifiers
        cascades = [join(cdir,cname,str(c)+'.xml') for c in range(self.nstages_total) ]
        self.classifiers = [cv.CascadeClassifier(c) for c in cascades]

    def saliency(self,src, min_size=60, max_size=400,
        face_neighbors=3, sal_neighbors=0, blur_kernel=(31,31), 
        scale_factor=1.1, start=1,end=None):
        
        self.face_neighbors = face_neighbors
        self.sal_neighbors = sal_neighbors
        self.scale_factor = scale_factor
        self.blur_kernel = blur_kernel
        self.min_size = (min_size, min_size)
        self.max_size = (max_size, max_size)

        # conver to grayscale
        src_gray = cv.cvtColor(src,cv.COLOR_BGR2GRAY)

        # run face detector on all stage-classifiers
        assert(start > 0 and start < len(self.classifiers))
        end = len(self.classifiers) if end is None else end
        assert(end > start and end <= len(self.classifiers))
        self.face_matrix = [self.detect_faces(src_gray,c) for c in self.classifiers[start:end]]

        # create saliency map in grayscale
        w,h = src.shape[1],src.shape[0]
        saliency = np.zeros((h,w), dtype=np.float32).reshape(h,w)

        # draw face-roi as stage-weighted grayscale vals
        # min_neighbors sets max value for grayscale --> white
        nstages = end-start
        for i,face_list in enumerate(self.face_matrix,1):
            inc = round(255./float(self.face_neighbors)/float(nstages)) * i
            if face_list is not None:
                for x1,y1,fw,fh in face_list:
                    saliency[y1:y1+fh,x1:x1+fw] += inc

        # normalize, clip, and recast as uint8
        smax = saliency.max()
        if smax > 255:
            saliency /= (smax/255)
        saliency = np.clip(saliency,0,255)
        saliency = np.array(saliency,dtype=np.uint8)
        
        # blur, colormap, and composite
        saliency = cv.GaussianBlur(saliency,self.blur_kernel,0)
        dst = cv.applyColorMap(saliency, cv.COLORMAP_JET)
        return dst

    def detect_faces(self,src,classifier):

        matches = classifier.detectMultiScale(src, self.scale_factor,
            self.sal_neighbors, self.flags, self.min_size, self.max_size)

        if matches is None or len(matches) < 1:
            return None
        else:
            return sorted(map(tuple,matches),reverse=True) # lg --> sm
def FeatureExtractor(framework='keras', net='VGG16', layer='default', weights='imagenet', size=None, cuda=False, config=None):
  if config is not None:
    framework = config.features.framework
    net = config.features.net
    weights = config.features.weights
    cuda = config.gpu

  if framework == 'keras' or framework == 'tf':
    from feature_extractor_tf import FeatureExtractor as FeatureExtractorTF
    fe = FeatureExtractorTF(net=net, weights=weights)
  if framework == 'pytorch':
    from feature_extractor_pytorch import FeatureExtractor as FeatureExtractorPyTorch
    return FeatureExtractorPyTorch(net=net, cuda=cuda)

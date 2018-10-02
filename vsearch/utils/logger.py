# Logger
import logging

class Logger:
	
	def __init__(self):
		pass

	def logger(self,name=None):
		logging.basicConfig(
	    filename=cfg.FP_LOGFILE,
	    level=logging.DEBUG,
	    format="%(asctime)s:%(levelname)s:%(message)s"
    )
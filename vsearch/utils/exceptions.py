
class FatalException(Exception):
    def __init__(self, msg):
        self.msg = msg
        super(FatalException, self).__init__('Fatal {}'.format(msg))
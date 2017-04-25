from eve.auth import BasicAuth

class TequAuth(BasicAuth):
    def check_auth(self, token, allowed_roles, resource, method):
        return True

    def authorized(self, allowed_roles, resource, method):
        try:
            token = request.headers.get('Authorization')
        except:
            token = None
        return self.check_auth(token, allowed_roles, resource, method)

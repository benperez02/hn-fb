from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from sqlalchemy.sql import func
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS on all routes
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clicks.db'
db = SQLAlchemy(app)
api = Api(app)

class ClickEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    url = db.Column(db.String(200))
    user_id = db.Column(db.Integer)

    def __init__(self, title, url, user_id):
        self.title = title
        self.url = url
        self.user_id = user_id

class ClickEventResource(Resource):
    def post(self):
        title = request.json.get('title')
        url = request.json.get('url')
        user_id = request.json.get('user_id')

        new_click = ClickEvent(title=title, url=url, user_id=user_id)
        db.session.add(new_click)
        db.session.commit()
        return {'message': 'Click event recorded successfully'}, 201

class TopPostsResource(Resource):
    def get(self):
        top_posts = db.session.query(ClickEvent.title, ClickEvent.url, func.count(ClickEvent.id).label('clicks')).group_by(ClickEvent.title, ClickEvent.url).order_by(func.count(ClickEvent.id).desc()).limit(10).all()
        return jsonify([{'title': title, 'url': url, 'clicks': clicks} for title, url, clicks in top_posts])

api.add_resource(ClickEventResource, '/clicks')
api.add_resource(TopPostsResource, '/top-posts')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

# 参考：https://qiita.com/nozomiyamada/items/87389aacb151b8418501
import logging
from pathlib import Path
from flask import Flask, request, abort
from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging import (
	ApiClient, Configuration, MessagingApi,
	ReplyMessageRequest, PushMessageRequest,
	TextMessage, PostbackAction, ImageMessage, MessagingApiBlob
)
from linebot.models import (ImageSendMessage)
from linebot.v3.webhooks import (
	FollowEvent, MessageEvent, PostbackEvent, TextMessageContent, ImageMessageContent
)
from dotenv import load_dotenv
import os

import google.generativeai as genai
import PIL.Image

logging.basicConfig(level=logging.INFO)
load_dotenv()

CHANNEL_ACCESS_TOKEN=os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET=os.environ["CHANNEL_SECRET"]
GEMINI_API_KEY=os.environ["GEMINI_API_KEY"]

app = Flask(__name__)

configuration = Configuration(access_token=CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(CHANNEL_SECRET)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)
    
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        app.logger.info("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)
    
    return 'OK'

@handler.add(FollowEvent)
def handle_follow(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)

    line_bot_api.reply_message(ReplyMessageRequest(
        replyToken=event.reply_token,
        messages=[TextMessage(text='Thank You!')]
    ))

@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
    
    #received_message = event.message.text

    ## APIを呼んで送信者のプロフィール取得
    #profile = line_bot_api.get_profile(event.source.user_id)
    #display_name = profile.display_name

    ## 返信メッセージ編集
    #reply = f'{display_name}さんのメッセージ\n{received_message}'

    response = model.generate_content({received_message})

    line_bot_api.reply_message(ReplyMessageRequest(
		replyToken=event.reply_token,
		messages=[TextMessage(text=response.text)]
	))

# 参考：https://qiita.com/tamago324/items/4df361fd6ac5b51a8a07
@handler.add(MessageEvent, message=ImageMessageContent)
def handle_image(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)

    message_id = event.message.id
    SRC_IMAGE_PATH = "static/images/{}.jpg"
    src_image_path = Path(SRC_IMAGE_PATH.format(message_id)).absolute()
    # 画像を保存
    save_image(message_id, src_image_path)
	
    organ = PIL.Image.open(src_image_path)
    response = model.generate_content(["個体値を調べて", organ])

    line_bot_api.reply_message(ReplyMessageRequest(
		replyToken=event.reply_token,
		messages=[TextMessage(text=response.text)]
    ))

def save_image(message_id: str, save_path: str) -> None:
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApiBlob(api_client)
    message_content = line_bot_api.get_message_content(message_id)
    with open(save_path, "wb") as f:
        f.write(message_content)

@app.route('/', methods=['GET'])
def toppage():
    return 'Hello World'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

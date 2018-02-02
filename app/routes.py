from flask import request, redirect, render_template, send_file
import os
from subprocess import call
from app import app

@app.route('/')
def index():
        return '''
        <!DOCTYPE html>
        <title>Upload PCAP</title>
        <h1>Upload PCAP</h1>
        <form action=/upload method=post enctype=multipart/form-data>
            <input type=file name=file>
            <input type=submit value=Upload>
        </form>
        '''

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        os.makedirs('data', exist_ok=True)
        request.files['file'].save('data/upload.pcap')
        with open('data/data.csv', 'w') as f:
            call(['tshark -r data/upload.pcap -T fields -e ip.src -e ip.dst -e _ws.col.Protocol -e _ws.col.Port -E header=y -E separator=,'], shell=True, stdout=f)
        return render_template('pcap_visualization.html')
    return "failed to upload"

@app.route('/data')
def get_file():
    return send_file(os.path.join('../data', 'data.csv'))

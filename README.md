# PCAP_visualization

This is a web app that creates a data visualization from a user uploaded pcap file. Each record in the visualization represents a 'conversation', with the arrows representing a single network message. Records are color coded based on protocol. Hovering over an ip will highlight all records that also contain that ip, whether it's the client or the server.

## Prerequisites
* Python
* Flask
* TShark

## How to run
`export FLASK_APP=pcap-importer.py`

`flask run`

## Screenshot

![pcap viz](https://image.prntscr.com/image/NmAvCP1AS1yJmzr57c8cmQ.png)

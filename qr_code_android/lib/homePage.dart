import 'dart:convert';

import 'package:barcode_scan/platform_wrapper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:qrcode/service/token.dart';

import 'app_config.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String qrCodeResult = "Not Yet Scanned";
  String _name = "";
  TokenService _tokenService = TokenService();
  var devices = [
    TableRow(children: [
      Column(children: [Text('Platform', style: TextStyle(fontSize: 20.0))]),
      Column(children: [Text('App', style: TextStyle(fontSize: 20.0))]),
      Column(children: [Text('Time', style: TextStyle(fontSize: 20.0))]),
    ])
  ];

  getName() async {
    var token = await _tokenService.getData("token");
    var url = Uri.parse(config.apiUrl + "/info");
    var res = await http.get(url, headers: {'Authorization': 'Bearer $token'});
    var data = jsonDecode(res.body);
    setState(() {
      _name = data["name"];
    });
  }

  @override
  void initState() {
    getName();
    super.initState();
  }

  @override
  void dispose() {
    _tokenService.removeData("token");
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Homepage"),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Container(
              constraints: BoxConstraints(minHeight: 100),
              padding: EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text(
                    "Hi, " + _name,
                    style:
                        TextStyle(fontSize: 25.0, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(
                    height: 20.0,
                  ),
                  FlatButton(
                    padding: EdgeInsets.all(15.0),
                    onPressed: () async {
                      var codeSanner =
                          await BarcodeScanner.scan(); //barcode scnner
                      var token = await _tokenService.getData("token");
                      var url = Uri.parse(
                          config.apiUrl + "/login-qr/" + codeSanner.rawContent);
                      var res = await http.post(url,
                          headers: {'Authorization': 'Bearer $token'});
                      setState(() {
                        qrCodeResult = codeSanner.toString();
                        var contentType = res.headers["content-type"];
                        if (contentType == "application/json") {
                          var body = jsonDecode(res.body);
                          var now = DateTime.now();
                          if (devices.length > 1) {
                            devices.removeLast();
                          }
                          devices.add(TableRow(children: [
                            Column(children: [
                              Text(body['platform'],
                                  style: TextStyle(fontSize: 20.0))
                            ]),
                            Column(children: [
                              Text(
                                  body['app'], style: TextStyle(fontSize: 20.0))
                            ]),
                            Column(children: [
                              Text(now.toString(),
                                  style: TextStyle(fontSize: 20.0))
                            ]),
                          ]));
                        }
                      });

                      // try{
                      //   BarcodeScanner.scan()    this method is used to scan the QR code
                      // }catch (e){
                      //   BarcodeScanner.CameraAccessDenied;   we can print that user has denied for the permisions
                      //   BarcodeScanner.UserCanceled;   we can print on the page that user has cancelled
                      // }
                    },
                    child: Text(
                      "Connect via QR",
                      style: TextStyle(
                          color: Colors.blue, fontWeight: FontWeight.bold),
                    ),
                    shape: RoundedRectangleBorder(
                        side: BorderSide(color: Colors.blue, width: 3.0),
                        borderRadius: BorderRadius.circular(20.0)),
                  )
                ],
              )),
          Table(
            children: this.devices,
            border: TableBorder.all(),
          )
        ],
      ),
    );
  }
}

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:qrcode/homePage.dart';
import 'package:qrcode/service/token.dart';

import 'app_config.dart';
import 'main.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String _login;
  String _password;
  TokenService _tokenService = TokenService();
  String qrData = "";

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("LoginPage"),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email',
              ),
              onChanged: (String login) {
                _login = login.toString();
              },
            ),
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Password',
              ),
              onChanged: (String pswd) {
                this._password = pswd.toString();
              },
            ),
            ElevatedButton(
              onPressed: () async {
                var url = Uri.parse(config.apiUrl + "/login");
                try {
                  var res = await http.post(url, body: {
                    'password': this._password,
                    'login': this._login,
                  });
                  if (res.statusCode == 200) {
                    _tokenService.saveData(
                        "token", jsonDecode(res.body)['token']);
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => HomePage()));
                  } else {
                    showSnackBar(context, jsonDecode(res.body));
                  }
                } catch (err) {
                  showSnackBar(context, err.toString());
                }
              },
              child: const Text('LogIn'),
            ),
          ],
        ),
      ),
    );
  }
}

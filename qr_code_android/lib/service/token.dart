import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class TokenService {
  SharedPreferences _ps;

  Future saveData(String key, String data) async {
    _ps = await SharedPreferences.getInstance();
    await _ps.setString(key, data);
  }

  Future<String> getData(String key) async {
    _ps = await SharedPreferences.getInstance();
    return _ps.getString(key);
  }

  Future removeData(String key) async {
    _ps = await SharedPreferences.getInstance();
    await _ps.remove(key);
  }
}

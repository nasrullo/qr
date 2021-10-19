class AppConfig {
  final String apiUrl;
  final String apiUrlWs;

  AppConfig(
    this.apiUrl,
    this.apiUrlWs,
  );
}

final AppConfig config =
    AppConfig("http://192.168.1.151:3000", "ws://192.168.1.151:3000/ws");

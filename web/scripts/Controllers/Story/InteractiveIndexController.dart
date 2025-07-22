import '../../SBURBSim.dart';
import '../../navbar.dart';
import 'dart:async';
import 'dart:html';
import 'StoryController.dart';

Session? currentSession;

Future<void> main() async {
  await globalInit();
  startTime = new DateTime.now();
  new Timer(new Duration(milliseconds: 1000), () => window.scrollTo(0, 0));

  window.onError.listen((Event event) {
    ErrorEvent e = event as ErrorEvent;
    printCorruptionMessage(SimController.instance.currentSessionForErrors, e);
    return;
  });

  loadNavbar();
  new StoryController();

  if (getParameterByName("seed", null) != null) {
    SimController.instance.initial_seed = int.parse(getParameterByName("seed", null));
  } else {
    SimController.instance.initial_seed = getRandomSeed();
  }

  SimController.instance.shareableURL();

  ButtonElement? startButton = querySelector('#startSession') as ButtonElement?;
  ButtonElement? stopButton = querySelector('#stopSession') as ButtonElement?;
  startButton?.onClick.listen((_) => startSession());
  stopButton?.onClick.listen((_) => stopSession());
}

Future<void> startSession() async {
  currentSession = new Session(SimController.instance.initial_seed);
  await currentSession!.startSession();
}

void stopSession() {
  window.location.reload();
}

import '../../SBURBSim.dart';
import '../../navbar.dart';
import 'dart:async';
import 'dart:html';
import '../Interactive/InteractiveSimController.dart';

Future<void> main() async {
  await globalInit();
  loadNavbar();

  window.onError.listen((Event event) {
    ErrorEvent e = event as ErrorEvent;
    printCorruptionMessage(SimController.instance.currentSessionForErrors, e);
    return;
  });

  new InteractiveSimController();

  if (getParameterByName("seed", null) != null) {
    SimController.instance.initial_seed = int.parse(getParameterByName("seed", null));
  } else {
    SimController.instance.initial_seed = getRandomSeed();
  }

  SimController.instance.shareableURL();
  startSession();
}

Future<void> startSession() async {
  Session session = new Session(SimController.instance.initial_seed);
  await session.startSession();
}

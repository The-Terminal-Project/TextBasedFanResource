import 'dart:async';
import 'dart:html';

import '../Misc/SimController.dart';
import '../../SBURBSim.dart';

class InteractiveSimController extends SimController {
  ButtonElement continueButton;
  Completer<void> _waiter;

  InteractiveSimController() : super() {
    continueButton = ButtonElement()
      ..id = 'continueButton'
      ..text = 'Continue';
    continueButton.style.display = 'none';
    storyElement.append(continueButton);
    continueButton.onClick.listen((e) {
      continueButton.style.display = 'none';
      _waiter?.complete();
    });
  }

  @override
  Future<void> afterTick(Session session) async {
    _waiter = Completer<void>();
    continueButton.style.display = 'block';
    await _waiter.future;
  }
}

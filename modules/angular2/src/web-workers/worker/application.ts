import {
  PostMessageBus,
  PostMessageBusSink,
  PostMessageBusSource
} from 'angular2/src/web-workers/shared/post_message_bus';
import {Type, BaseException} from "angular2/src/facade/lang";
import {Binding} from "angular2/di";
import {Map} from 'angular2/src/facade/collection';
import {Promise} from 'angular2/src/facade/async';
import {bootstrapWebWorkerCommon} from "angular2/src/web-workers/worker/application_common";
import {ApplicationRef} from "angular2/src/core/application";
import {Injectable} from "angular2/di";

// TODO(jteplitz602) remove this and compile with lib.webworker.d.ts (#3492)
interface PostMessageInterface {
  (message: any, transferrables?:[ArrayBuffer]): void;
}
var _postMessage: PostMessageInterface = <any>postMessage;

/**
 * Bootstrapping a Webworker Application
 *
 * You instantiate the application side by calling bootstrapWebworker from your webworker index
 * script.
 * You can call bootstrapWebworker() exactly as you would call bootstrap() in a regular Angular
 * application
 * See the bootstrap() docs for more details.
 */
export function bootstrapWebWorker(
    appComponentType: Type, componentInjectableBindings: List<Type | Binding | List<any>> = null):
    Promise<ApplicationRef> {
  var sink = new PostMessageBusSink({
    postMessage:
        (message: any, transferrables?:[ArrayBuffer]) => { _postMessage(message, transferrables); }
  });
  var source = new PostMessageBusSource();
  var bus = new PostMessageBus(sink, source);

  return bootstrapWebWorkerCommon(appComponentType, bus, componentInjectableBindings);
}

#include <napi.h>
#include "Samples/nodeAddons.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {

  return ClassExample::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)

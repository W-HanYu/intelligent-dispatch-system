{
    "targets": [{
        "target_name": "intelligent-dispatch-system",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "./intelligent-dispatch-algorithm/main.cc",
            "./intelligent-dispatch-algorithm/src/algorithms.cc",
            "./intelligent-dispatch-algorithm/src/nodeAddons.cc"
        ],
        'include_dirs': [
             "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS'  ]
    }]
}

{
    "targets": [{
        "target_name": "intelligent-dispatch-system",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "./cppsrc/main.cpp",
            "./cppsrc/Samples/actualclass.cpp",
            "./cppsrc/Samples/nodeAddons.cpp"
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

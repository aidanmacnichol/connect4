cmake_minimum_required(VERSION 3.16)
project(connect4_engine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Shared game logic (used by native CLI and WASM).
add_library(connect4_core
  src/board.cpp
  src/game.cpp
)
target_include_directories(connect4_core PUBLIC include)

if(MSVC)
  target_compile_options(connect4_core PRIVATE /W4)
else()
  target_compile_options(connect4_core PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(EMSCRIPTEN)
  # Browser module: React imports the generated .js + .wasm.
  add_executable(connect4_wasm
    src/bindings.cpp
  )
  target_link_libraries(connect4_wasm PRIVATE connect4_core)

  set_target_properties(connect4_wasm PROPERTIES
    OUTPUT_NAME "connect4"
    # Vite can import JS from src/; /public JS cannot be imported as a module.
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../web/src/wasm"
  )

  target_link_options(connect4_wasm PRIVATE
    --bind
    -sMODULARIZE=1
    -sEXPORT_NAME=createConnect4Module
    -sEXPORT_ES6=1
    -sENVIRONMENT=web
    -sALLOW_MEMORY_GROWTH=1
    -sFILESYSTEM=0
    -sASSERTIONS=1
  )
else()
  # Native terminal game.
  add_executable(connect4
    src/main.cpp
  )
  target_link_libraries(connect4 PRIVATE connect4_core)

  if(MSVC)
    target_compile_options(connect4 PRIVATE /W4)
  else()
    target_compile_options(connect4 PRIVATE -Wall -Wextra -Wpedantic)
  endif()
endif()

#!/usr/bin/env node
'use strict';

require('./src/cli')
  .run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });

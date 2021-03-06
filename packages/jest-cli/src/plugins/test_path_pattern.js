/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {GlobalConfig} from 'types/Config';
import WatchPlugin from '../watch_plugin';
import TestPathPatternPrompt from '../test_path_pattern_prompt';
import activeFilters from '../lib/active_filters_message';
import Prompt from '../lib/Prompt';

class TestPathPatternPlugin extends WatchPlugin {
  _prompt: Prompt;

  constructor(options: {
    stdin: stream$Readable | tty$ReadStream,
    stdout: stream$Writable | tty$WriteStream,
  }) {
    super(options);
    this._prompt = new Prompt();
  }

  getUsageRow() {
    return {
      key: 'p'.codePointAt(0),
      prompt: 'filter by a filename regex pattern',
    };
  }

  onData(key: string) {
    this._prompt.put(key);
  }

  showPrompt(
    globalConfig: GlobalConfig,
    updateConfigAndRun: Function,
  ): Promise<void> {
    return new Promise((res, rej) => {
      const testPathPatternPrompt = new TestPathPatternPrompt(
        this._stdout,
        this._prompt,
      );

      testPathPatternPrompt.run(
        (value: string) => {
          updateConfigAndRun({testPathPattern: value});
          res();
        },
        rej,
        {
          header: activeFilters(globalConfig),
        },
      );
    });
  }
}

export default TestPathPatternPlugin;

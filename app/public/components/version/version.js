'use strict';

angular.module('getCrafty.version', [
  'getCrafty.version.interpolate-filter',
  'getCrafty.version.version-directive'
])

.value('version', '0.1');

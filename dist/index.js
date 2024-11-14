/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 859:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 577:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(859);
const exec = __nccwpck_require__(577);

async function run() {
    try {
        let imageVersion = core.getInput('docker-version');
        const location = core.getInput('location') || '';
        const instance = core.getInput('instance');
        const artifact = core.getInput('artifact');
        const pdf = core.getInput('pdf');
        const workspace = process.env.GITHUB_WORKSPACE;

        // Set a default docker image if docker-version is undefined
        if (!imageVersion) {
            imageVersion = '232.10275';
        }

        // Set pdf flag if pdf is true
        let pdfFlag = '';
        if (pdf) {
            pdfFlag = `-pdf ${pdf}`;
        }

        const commands = `
            export DISPLAY=:99
            Xvfb :99 &
            git config --global --add safe.directory /github/workspace
            /opt/builder/bin/idea.sh helpbuilderinspect -source-dir /github/workspace/${location} -product ${instance} --runner github -output-dir /github/workspace/artifacts/ ${pdfFlag} || true
            echo "Test existing artifacts"
            test -e /github/workspace/artifacts/${artifact} && echo ${artifact} exists
            if [ -z "$(ls -A /github/workspace/artifacts/ 2>/dev/null)" ]; then
               echo "Artifacts not found" && false
            else
               chmod 777 /github/workspace/artifacts/
               ls -la /github/workspace/artifacts/
            fi
        `;

        // Run your Docker container
        await exec.exec('docker', [
            'run',
            '--rm',
            '-v',
            `${workspace}:/github/workspace`,
            `registry.jetbrains.team/p/writerside/builder/writerside-builder:${imageVersion}`,
            '/bin/bash',
            '-c',
            commands
        ]);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();
module.exports = __webpack_exports__;
/******/ })()
;
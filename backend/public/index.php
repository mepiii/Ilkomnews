<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

// ponytail: terminate() before send() so terminating middleware
// (e.g. EmitCsrfCookie) can attach Set-Cookie to the FINAL response
// — including 401/419/500 produced by the exception handler. Previously
// send() flushed headers first, then terminate() mutated the in-memory
// response too late for the wire, so the SPA's priming GET to
// /api/admin/user never got an XSRF-TOKEN cookie, login POSTs failed
// with 419, and the login screen showed a stuck spinner ('Request
// timeout' from the SPA's abort handler).
$response = $kernel->handle(
    $request = Request::capture()
);
$kernel->terminate($request, $response);
$response->send();

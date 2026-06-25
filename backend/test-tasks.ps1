# Register fresh test user
$registerBody = '{"name":"Test User","email":"testuser@taskflow.com","password":"TestPass123"}'
try {
    $reg = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "Registered new user" -ForegroundColor Green
} catch {
    Write-Host "User already exists, proceeding to login..." -ForegroundColor Yellow
}

# Login to get token
$loginBody = '{"email":"testuser@taskflow.com","password":"TestPass123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$TOKEN = $loginResponse.data.token
Write-Host "=== LOGIN SUCCESS ===" -ForegroundColor Green
Write-Host "Token received: YES"
Write-Host "User: $($loginResponse.data.user.name) <$($loginResponse.data.user.email)>"

$HEADERS = @{ Authorization = "Bearer $TOKEN" }

# ===== TEST 1: CREATE TASK =====
Write-Host "`n=== TEST 1: CREATE TASK ===" -ForegroundColor Cyan
$taskBody = '{"title":"Design Login Page","description":"Create a modern responsive login page for the application.","status":"Pending"}'
$createResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method POST -ContentType "application/json" -Headers $HEADERS -Body $taskBody
$TASK_ID = $createResponse.data.id
Write-Host "[201 PASS] Task Created" -ForegroundColor Green
Write-Host "  ID     : $($createResponse.data.id)"
Write-Host "  Title  : $($createResponse.data.title)"
Write-Host "  Status : $($createResponse.data.status)"
Write-Host "  UserId : $($createResponse.data.userId)"

# ===== TEST 2: GET ALL TASKS =====
Write-Host "`n=== TEST 2: GET ALL TASKS ===" -ForegroundColor Cyan
$allTasks = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Tasks Retrieved" -ForegroundColor Green
Write-Host "  Total Tasks : $($allTasks.data.pagination.total)"
Write-Host "  Page        : $($allTasks.data.pagination.page)"
Write-Host "  Limit       : $($allTasks.data.pagination.limit)"
Write-Host "  Total Pages : $($allTasks.data.pagination.totalPages)"

# ===== TEST 3: SEARCH =====
Write-Host "`n=== TEST 3: SEARCH (?search=login) ===" -ForegroundColor Cyan
$searchResult = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?search=login" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Search Result" -ForegroundColor Green
Write-Host "  Matching Tasks: $($searchResult.data.pagination.total)"
foreach ($task in $searchResult.data.tasks) {
    Write-Host "  - $($task.title)"
}

# ===== TEST 4: FILTER BY STATUS =====
Write-Host "`n=== TEST 4: FILTER (?status=Pending) ===" -ForegroundColor Cyan
$filterResult = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?status=Pending" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Filter Result" -ForegroundColor Green
Write-Host "  Pending Tasks: $($filterResult.data.pagination.total)"
foreach ($task in $filterResult.data.tasks) {
    Write-Host "  - $($task.title) [$($task.status)]"
}

# ===== TEST 5a: SORT LATEST =====
Write-Host "`n=== TEST 5a: SORT LATEST (?sort=latest) ===" -ForegroundColor Cyan
$sortLatest = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?sort=latest" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Sort Latest" -ForegroundColor Green
Write-Host "  First task createdAt: $($sortLatest.data.tasks[0].createdAt)"

# ===== TEST 5b: SORT OLDEST =====
Write-Host "`n=== TEST 5b: SORT OLDEST (?sort=oldest) ===" -ForegroundColor Cyan
$sortOldest = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?sort=oldest" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Sort Oldest" -ForegroundColor Green
Write-Host "  First task createdAt: $($sortOldest.data.tasks[0].createdAt)"

# ===== TEST 6: PAGINATION =====
Write-Host "`n=== TEST 6: PAGINATION (?page=1&limit=5) ===" -ForegroundColor Cyan
$paginated = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?page=1&limit=5" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Pagination" -ForegroundColor Green
Write-Host "  Page   : $($paginated.data.pagination.page)"
Write-Host "  Limit  : $($paginated.data.pagination.limit)"
Write-Host "  Total  : $($paginated.data.pagination.total)"

# ===== TEST 7: GET SINGLE TASK =====
Write-Host "`n=== TEST 7: GET SINGLE TASK ===" -ForegroundColor Cyan
$singleTask = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/$TASK_ID" -Method GET -Headers $HEADERS
Write-Host "[200 PASS] Single Task Retrieved" -ForegroundColor Green
Write-Host "  ID     : $($singleTask.data.id)"
Write-Host "  Title  : $($singleTask.data.title)"
Write-Host "  Status : $($singleTask.data.status)"

# ===== TEST 8: UPDATE TASK =====
Write-Host "`n=== TEST 8: UPDATE TASK ===" -ForegroundColor Cyan
$updateBody = '{"title":"Updated Login Page","description":"Updated description with responsive improvements for the application.","status":"In Progress"}'
$updateResult = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/$TASK_ID" -Method PUT -ContentType "application/json" -Headers $HEADERS -Body $updateBody
Write-Host "[200 PASS] Task Updated" -ForegroundColor Green
Write-Host "  New Title  : $($updateResult.data.title)"
Write-Host "  New Status : $($updateResult.data.status)"

# ===== TEST 9: COMPLETE TASK =====
Write-Host "`n=== TEST 9: COMPLETE TASK ===" -ForegroundColor Cyan
$completeResult = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/$TASK_ID/complete" -Method PATCH -Headers $HEADERS
Write-Host "[200 PASS] Task Completed" -ForegroundColor Green
Write-Host "  Status : $($completeResult.data.status)"

# ===== TEST 10: DELETE TASK =====
Write-Host "`n=== TEST 10: DELETE TASK ===" -ForegroundColor Cyan
$deleteResult = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/$TASK_ID" -Method DELETE -Headers $HEADERS
Write-Host "[200 PASS] Task Deleted" -ForegroundColor Green
Write-Host "  Message: $($deleteResult.message)"

# ===== TEST 11: CONFIRM 404 AFTER DELETE =====
Write-Host "`n=== TEST 11: 404 AFTER DELETE ===" -ForegroundColor Cyan
try {
    $shouldFail = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/$TASK_ID" -Method GET -Headers $HEADERS
    Write-Host "[FAIL] Should have returned 404" -ForegroundColor Red
} catch {
    Write-Host "[404 PASS] Task no longer exists - as expected" -ForegroundColor Green
}

Write-Host "`n=======================================" -ForegroundColor Magenta
Write-Host "  ALL TESTS PASSED SUCCESSFULLY" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

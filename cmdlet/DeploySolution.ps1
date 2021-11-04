$SRCpath = (Resolve-Path ..\).Path;
$scriptPath = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
# $DeployPath = (Resolve-Path ..\..\DEPLOY).Path;
# $ConnectionConfigFilePath = "$($DeployPath)\config-dev.json"
$ConnectionConfigFilePath = "$($scriptPath)\config-dev.json"
# Import Library
. "$scriptPath\CreateAppCatalog.ps1"

# Gulp sequence to bundle and package solution
try {
  gulp dist
}
catch {
  Write-Host "WARNING: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Get Package Solution
$package = Get-Content "$($SRCpath)\config\package-solution.json" | Out-String | ConvertFrom-Json
$zippedPackage = "$($SRCpath)\sharepoint\$($package.paths.zippedPackage)"

# Get configuration JSON in Deploy Path
if (Test-Path -Path $ConnectionConfigFilePath -PathType Leaf) {
  $configJSON = Get-Content $ConnectionConfigFilePath | Out-String | ConvertFrom-Json
  $url = $configJSON.siteUrl
}
else {
  Write-Host -f Red "ERROR: Cannot find '$($ConnectionConfigFilePath)'"
  Exit
}

#Create SP Credential
$passwordSec = ConvertTo-SecureString -String $configJSON.password -AsPlainText -Force
$SPCred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $configJSON.userName, $passwordSec

if (Test-Path -Path $zippedPackage -PathType Leaf) {

  #PNP Connection
  try {
    Write-Host "Connecting PNP Online..." -ForegroundColor Green
    $pnpConn = Connect-PnPOnline -Url $url -Credentials $SPCred -ReturnConnection
    Write-Host "Connected PNP Online `n" -ForegroundColor Green
  }
  catch {
    Write-Host "WARNING: $($_.Exception.Message)" -ForegroundColor Yellow
    Exit
  }

  if ($pnpConn -ne $null) {
    try {
      
      $tenantUrl = $configJSON.tenantUrl
      $siteUrl = $jsonConfig.siteUrl
      . "$scriptPath\CreateAppCatalog.ps1"
    
      # find if app exists
      Write-Host "Searching Solution..." -ForegroundColor Green
      $app = Get-PnPApp -Identity $package.solution.id -Scope Site -ErrorAction SilentlyContinue

      if ($app -ne $null) {

        Write-Host "Updating Solution..." -ForegroundColor Green

        # overwrite app to App Catalog
        $app = Add-PnPApp -Path $zippedPackage -Scope Site -Publish -Overwrite
        if ($app.Deployed) {
          Write-host "INFO: $($package.solution.id) Deployed!" -foregroundcolor green
        }

        # if new version
        if ($app.CanUpgrade) {
          Write-Host -f Green "INFO: Waiting Install..." -NoNewline
          While ($app.AppCatalogVersion -ne $app.InstalledVersion) {
            Update-PnPApp -Identity $app.Id -Scope Site -ErrorAction SilentlyContinue
            $app = Get-PnPApp -Identity $app.Id -Scope Site
            Write-Host -f Green "." -NoNewline
            sleep 5
          }
          Write-Host ""
        }

      }
      else {
        Write-Host "Adding Solution..." -ForegroundColor Green

        # add app from App Catalog
        $app = Add-PnPApp -Path $zippedPackage -Scope Site -Publish
        if ($app.Deployed) {
          Write-host "INFO: $($package.solution.id) Deployed!" -foregroundcolor green
        }

        # install app from Site Colection
        Install-PnPApp -Identity $package.solution.id -Scope Site
        Write-host "INFO: $($package.solution.id) Adding! `n" -foregroundcolor green
      }
    }
    catch {
      Write-Host "WARNING: $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }
  else {
    Write-Host -f Red "Error: Cannot Connect PnPOnline"
  }
}
else {
  Write-Host -f Yellow "INFO: Package not found. Please run the following commands"
  Write-Host -f Yellow "> gulp bundle --ship"
  Write-Host -f Yellow "> gulp package-solution --ship"
}
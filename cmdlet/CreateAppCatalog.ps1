
try {
    Write-Host -ForegroundColor Green "Connecting on Tenant... `n"
    Connect-SPOService -Url $tenantUrl -Credential $cred 
    $appCatalogs = Get-SPOSiteCollectionAppCatalogs -Site $siteUrl
    $searchApp = $appCatalogs | ? { $_.AbsoluteUrl -eq $siteUrl }

    if ($searchApp -eq $null) {
        try{
            Add-SPOSiteCollectionAppCatalog -Site $siteUrl
            Write-Host "SUCCESS: AppCatalog created successfully in $($siteUrl)/AppCatalog" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        #Remove-SPOSiteCollectionAppCatalogById -SiteId dcf128a9-4139-4e88-986f-05bd541f2386
        Write-Host "WARNING: AppCatalog already exists in $($searchApp.AbsoluteUrl)/AppCatalog" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

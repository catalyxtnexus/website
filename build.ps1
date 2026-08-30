# Assembles the multipage site from shared partials + per-page content.
# Run: powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'

$pages = @(
  @{ File = 'about.html';        Title = 'About — Catalyxt Nexus';            Desc = 'Catalyxt Nexus is a creator partnership network built by professionals experienced in influencer collaborations and digital campaigns.' },
  @{ File = 'services.html';     Title = 'Services — Catalyxt Nexus';         Desc = 'Influencer marketing for brands and a creator collaboration program for creators — matched around your goals.' },
  @{ File = 'process.html';      Title = 'How It Works — Catalyxt Nexus';     Desc = 'A simple, transparent process from enquiry to campaign reporting.' },
  @{ File = 'plans.html';        Title = 'Plans & Pricing — Catalyxt Nexus';  Desc = 'Flexible influencer marketing plans: Nexus Core, Nexus Growth and Nexus Elite.' },
  @{ File = 'for-brands.html';   Title = 'For Brands — Catalyxt Nexus';       Desc = 'Reach the right audience through carefully selected creators, with campaigns designed around measurable outcomes.' },
  @{ File = 'for-creators.html'; Title = 'For Creators — Catalyxt Nexus';     Desc = 'Join a creator-first network that offers paid, transparent collaborations and an official certificate.' },
  @{ File = 'faqs.html';         Title = 'FAQs — Catalyxt Nexus';             Desc = 'Answers to common questions about joining, payments, budgets and campaigns.' },
  @{ File = 'contact.html';      Title = 'Contact — Catalyxt Nexus';          Desc = 'Get in touch with Catalyxt Nexus via email, Instagram, WhatsApp or LinkedIn.' }
)

$top    = Get-Content -LiteralPath '_partials/page-top.html' -Raw
$bottom = Get-Content -LiteralPath '_partials/page-bottom.html' -Raw

foreach ($p in $pages) {
  $content = Get-Content -LiteralPath ("_pages/" + $p.File) -Raw
  $html = $top.Replace('{{TITLE}}', $p.Title).Replace('{{DESC}}', $p.Desc) + $content + $bottom
  Set-Content -LiteralPath $p.File -Value $html -Encoding UTF8
  Write-Output ("Built " + $p.File + "  (" + [math]::Round($html.Length / 1024) + " KB)")
}
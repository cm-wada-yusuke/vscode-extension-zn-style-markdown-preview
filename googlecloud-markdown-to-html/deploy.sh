gcloud functions deploy \
zennStyleMarkdownToHtmlForMe \
--trigger-http \
--region=asia-northeast1 \
--source=./dist \
--entry-point=zennStyleMarkdownToHtml \
--trigger-http \
--runtime=nodejs16 \
--memory=256 \
--timeout=25 \
--allow-unauthenticated \
--project=$1
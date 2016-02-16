#!/usr/bin/env bash

declare -r PRIVATE_KEY_FILE_NAME='github-deploy-key';

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Decrypt the file containing the private key.

openssl aes-256-cbc \
	-K $encrypted_f8a826b60c9b_key \
	-iv $encrypted_f8a826b60c9b_iv \
	-in "$(dirname "${BASH_SOURCE}")/${PRIVATE_KEY_FILE_NAME}.enc" \
	-out ~/.ssh/$PRIVATE_KEY_FILE_NAME -d;

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Enable SSH authentication.

chmod 600 ~/.ssh/$PRIVATE_KEY_FILE_NAME;
echo 'Host github.com' >> ~/.ssh/config;
echo "  IdentityFile ~/.ssh/${PRIVATE_KEY_FILE_NAME}" >> ~/.ssh/config;

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Update the content on the `gh-pages` branch.

$(npm bin)/update-branch --commands 'npm run build' \
	--commit-message 'Update gh-pages [skip ci]' \
	--directory 'dest' \
	--distribution-branch 'gh-pages' \
	--source-branch 'master';

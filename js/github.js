// ══ GITHUB API ══
function fetchGitHub() {
  fetch('https://api.github.com/users/KikeGonRam')
    .then(r => r.json())
    .then(data => {
      const repos = document.getElementById('gh-repos');
      const followers = document.getElementById('gh-followers');
      const gists = document.getElementById('gh-gists');
      if (repos && data.public_repos !== undefined) repos.textContent = data.public_repos;
      if (followers && data.followers !== undefined) followers.textContent = data.followers;
      if (gists && data.public_gists !== undefined) gists.textContent = data.public_gists;
    })
    .catch(() => {
      ['gh-repos','gh-followers','gh-gists'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '--';
      });
    });
}

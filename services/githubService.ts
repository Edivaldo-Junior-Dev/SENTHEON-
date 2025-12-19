
export const fetchGitHubStatus = async (token: string, repo: string) => {
    if (!token || !repo) return null;
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/commits`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) return null;
        const commits = await response.json();
        return {
            lastCommit: commits[0]?.commit?.message || 'Nenhum commit encontrado',
            sha: commits[0]?.sha?.substring(0, 7),
            date: commits[0]?.commit?.author?.date,
            count: commits.length
        };
    } catch (e) {
        return null;
    }
};

export const LINKS = {
	DOCS: "https://docs.fermilabs.xyz",
	APP: "https://testnet.fermilabs.xyz",
	WHITEPAPER: "/whitepaper.pdf",
	TWITTER: "https://x.com/FermiLabs",
	DISCORD: "https://discord.gg/kNcktKSk7u",
};

export interface Project {
	name: string;
	description: string;
	url: string;
	icon?: string;
}

export const PROJECTS: Project[] = [
	{
		name: "Fermi DEX",
		description: "Instant finality, capital efficient decentralized exchange",
		url: LINKS.APP,
	},
	{
		name: "Continuum",
		description: "Modular sequencing layer for fair transaction ordering",
		url: LINKS.DOCS,
	},
	{
		name: "Research",
		description: "Exploring the future of DeFi and blockchain technology",
		url: LINKS.DOCS,
	},
];

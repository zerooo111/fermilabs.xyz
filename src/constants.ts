export const LINKS = {
	DOCS: "https://docs.fermilabs.xyz",
	CONTNIUUM:"https://continuu.wtf",
	APP: "https://testnet.fermi.trade",
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
		name: "Fermi Trade",
		description: "Instant finality, capital efficient decentralized exchange",
		url: LINKS.APP,
	},
	{
		name: "Continuum",
		description: "Modular sequencing layer for fair transaction ordering",
		url: LINKS.CONTNIUUM,
	},
	{
		name: "Research",
		description: "Exploring the future of DeFi and blockchain technology",
		url: LINKS.DOCS,
	},
];

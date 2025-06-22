import styled from "styled-components";

const Container = styled.div`
	padding: 0;
	line-height: 1.6;
	color: #ccc;
	width: 100%;
	max-width: none;
`;

const Header = styled.div`
	text-align: center;
	margin-bottom: 40px;
	padding: 30px 40px;
	background: linear-gradient(135deg, rgba(145, 71, 255, 0.1) 0%, rgba(145, 71, 255, 0.05) 100%);
	border-radius: 12px;
	border: 1px solid rgba(145, 71, 255, 0.2);
`;

const Title = styled.h1`
	color: #9147ff;
	margin: 0 0 12px 0;
	font-size: 3rem;
	font-weight: 700;
	text-shadow: 0 0 20px rgba(145, 71, 255, 0.3);
`;

const Subtitle = styled.p`
	font-size: 1.3rem;
	margin: 0 0 16px 0;
	color: #e0e0e0;
	opacity: 0.9;
`;

const VersionBadge = styled.div`
	display: inline-block;
	background: rgba(145, 71, 255, 0.2);
	color: #9147ff;
	padding: 9px 22px;
	border-radius: 20px;
	font-size: 1.1rem;
	font-weight: 600;
	border: 1px solid rgba(145, 71, 255, 0.3);
`;

const Section = styled.div`
	padding: 0 20px;
`;

const SectionTitle = styled.h2`
	color: #9147ff;
	margin: 0 0 20px 0;
	font-size: 1.8rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8px;

	&::before {
		content: '';
		width: 4px;
		height: 22px;
		background: linear-gradient(to bottom, #9147ff, #b147ff);
		border-radius: 2px;
	}
`;

const SubSectionTitle = styled.h3`
	margin: 26px 0 14px 0;
	color: #fff;
	font-size: 1.35rem;
	font-weight: 500;
`;

const Description = styled.p`
	margin-bottom: 22px;
	color: #ccc;
	font-size: 1.1rem;
`;

const ContributorGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 12px;
	margin-bottom: 22px;
`;

const ContributorTag = styled.div`
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 1.05rem;
	color: #e0e0e0;
	text-align: center;
	transition: all 0.2s ease;

	&:hover {
		background: rgba(145, 71, 255, 0.1);
		border-color: rgba(145, 71, 255, 0.3);
		color: #fff;
		transform: translateY(-1px);
	}
`;

const SocialSection = styled.div`
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	padding: 26px;
	margin: 34px 20px 32px 20px;
`;

const SocialLinksContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
	gap: 16px;
	margin-top: 18px;
`;

const SocialLink = styled.a`
	color: #9147ff;
	text-decoration: none;
	display: flex;
	align-items: center;
	font-size: 1.1rem;
	padding: 15px 20px;
	background: rgba(145, 71, 255, 0.05);
	border: 1px solid rgba(145, 71, 255, 0.2);
	border-radius: 8px;
	transition: all 0.2s ease;

	&:hover {
		background: rgba(145, 71, 255, 0.1);
		border-color: rgba(145, 71, 255, 0.4);
		transform: translateY(-1px);
		text-decoration: none;
	}
`;

const IconImage = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 12px;
	filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(4577%) hue-rotate(252deg) brightness(101%)
	contrast(101%);
`;

const SmallText = styled.p`
	font-size: 0.95rem;
	color: #999;
	margin: 26px 20px 0 20px;
	text-align: center;
	font-style: italic;
`;

const BugReportText = styled.p`
	margin-bottom: 18px;
	color: #ccc;
	font-size: 1.1rem;
`;

interface EnhancerAboutComponentProps {
	icons: {
		website: string;
		github: string;
		twitter: string;
		discord: string;
	};
}

export function EnhancerAboutComponent({ icons }: EnhancerAboutComponentProps) {
	return (
		<Container>
			<Header>
				<Title>Enhancer</Title>
				<Subtitle>Open-source extension that adds missing features to streaming platforms</Subtitle>
				<VersionBadge>Version {__version__}</VersionBadge>
			</Header>

			<SocialSection>
				<SectionTitle>Get in Touch</SectionTitle>
				<BugReportText>
					Found a bug or have a suggestion? We'd love to hear from you! Report issues on GitHub or join our Discord
					community.
				</BugReportText>

				<SocialLinksContainer>
					<SocialLink href="https://enhancer.at" target="_blank" rel="noopener noreferrer">
						<IconImage src={icons.website} alt="Website" />
						Website
					</SocialLink>
					<SocialLink href="https://sh.enhancer.at/s/github" target="_blank" rel="noopener noreferrer">
						<IconImage src={icons.github} alt="GitHub" />
						GitHub
					</SocialLink>
					<SocialLink href="https://sh.enhancer.at/s/twitter" target="_blank" rel="noopener noreferrer">
						<IconImage src={icons.twitter} alt="X (Twitter)" />X (Twitter)
					</SocialLink>
					<SocialLink href="https://sh.enhancer.at/s/dc" target="_blank" rel="noopener noreferrer">
						<IconImage src={icons.discord} alt="Discord" />
						Discord
					</SocialLink>
				</SocialLinksContainer>
			</SocialSection>

			<Section>
				<SectionTitle>Acknowledgements</SectionTitle>
				<Description>Thanks to everyone who helped make this extension possible:</Description>

				<SubSectionTitle>Contributors</SubSectionTitle>
				<ContributorGrid>
					<ContributorTag key="igorovh">igorovh</ContributorTag>
					<ContributorTag key="czestereq">czestereq</ContributorTag>
					<ContributorTag key="d33zor">d33zor</ContributorTag>
					<ContributorTag key="kawre">kawre</ContributorTag>
					<ContributorTag key="usermacieg">usermacieg</ContributorTag>
				</ContributorGrid>

				<SubSectionTitle>Testers</SubSectionTitle>
				<ContributorGrid>
					<ContributorTag key="piotrgamerpl">piotrgamerpl</ContributorTag>
					<ContributorTag key="m0rtak_">m0rtak_</ContributorTag>
					<ContributorTag key="conki__">conki__</ContributorTag>
					<ContributorTag key="grzegoryflorida">grzegoryflorida</ContributorTag>
					<ContributorTag key="jsdthe1st">jsdthe1st</ContributorTag>
					<ContributorTag key="mxj1337">mxj1337</ContributorTag>
					<ContributorTag key="h2p_ygus">h2p_ygus</ContributorTag>
					<ContributorTag key="marekkk2007">marekkk2007</ContributorTag>
					<ContributorTag key="nowy_lepszy_silver">nowy_lepszy_silver</ContributorTag>
					<ContributorTag key="plyta__">plyta__</ContributorTag>
					<ContributorTag key="kolegajakub_">kolegajakub_</ContributorTag>
					<ContributorTag key="mrsono1212">mrsono1212</ContributorTag>
					<ContributorTag key="rqqn_">rqqn_</ContributorTag>
				</ContributorGrid>

				<SubSectionTitle>Special Thanks</SubSectionTitle>
				<ContributorGrid>
					<ContributorTag key="lewus">lewus</ContributorTag>
					<ContributorTag key="nyloniarz">nyloniarz</ContributorTag>
					<ContributorTag key="b3akers">b3akers</ContributorTag>
					<ContributorTag key="xyves">xyves</ContributorTag>
				</ContributorGrid>
			</Section>
		</Container>
	);
}

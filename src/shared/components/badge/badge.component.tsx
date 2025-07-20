import styled from "styled-components";

interface BadgeComponentProps {
	name: string;
	sourceUrl: string;
	marginTop?: string;
	marginLeft?: string;
	marginRight?: string;
}

const Icon = styled.img<Partial<BadgeComponentProps>>`
	width: 18px !important;
	height: 18px !important;
	margin-top: ${(props) => props.marginTop || "0"};
	margin-left: ${(props) => props.marginLeft || "0"};
	margin-right: ${(props) => props.marginRight || "0"};
`;

export function BadgeComponent({ name, sourceUrl, marginTop, marginLeft, marginRight }: BadgeComponentProps) {
	return <Icon src={sourceUrl} alt={name} marginTop={marginTop} marginLeft={marginLeft} marginRight={marginRight} />;
}

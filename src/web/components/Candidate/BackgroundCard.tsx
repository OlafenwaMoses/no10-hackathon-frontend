import styled from "@emotion/styled";
import { useState } from "react";
import type { ExaPersonEntity, LinkedInProfile, Resolution } from "@api-types";
import { Eyebrow, SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import ProfileMatch from "./ProfileMatch";

type Dates = { from?: string | null; to?: string | null } | null | undefined;

type Role = { title: string | null; company: string | null; description: string | null; dates: Dates };

type School = { name: string; detail: string | null; dates: Dates };

const MAX_ROLES = 5;
const MAX_SCHOOLS = 3;
const MAX_SKILLS = 12;

function yearOf(value: string | null | undefined) {
  if (!value) return null;
  const match = /\d{4}/.exec(value);
  return match ? match[0] : value;
}

function formatDates(dates: Dates) {
  if (!dates) return null;
  const from = yearOf(dates.from);
  const to = yearOf(dates.to);
  if (!from && !to) return null;
  return `${from ?? "?"} – ${to ?? "Present"}`;
}

function rolesFrom(entity: ExaPersonEntity | null, linkedin: LinkedInProfile | null): Role[] {
  if (linkedin && linkedin.positions.length > 0) {
    return linkedin.positions
      .filter((position) => position.title || position.company)
      .map((position) => ({
        title: position.title,
        company: position.company,
        description: position.description,
        dates: { from: position.start, to: position.end },
      }));
  }
  return (entity?.properties.workHistory ?? [])
    .filter((role) => role.title || role.company?.name)
    .map((role) => ({
      title: role.title ?? null,
      company: role.company?.name ?? null,
      description: null,
      dates: role.dates,
    }));
}

function schoolsFrom(entity: ExaPersonEntity | null, linkedin: LinkedInProfile | null): School[] {
  if (linkedin && linkedin.education.length > 0) {
    return linkedin.education.flatMap((school) =>
      school.school
        ? [
            {
              name: school.school,
              detail: [school.degree, school.fieldOfStudy].filter(Boolean).join(", ") || null,
              dates: { from: school.start, to: school.end },
            },
          ]
        : [],
    );
  }
  return (entity?.properties.educationHistory ?? []).flatMap((school) =>
    school.institution?.name
      ? [{ name: school.institution.name, detail: school.degree ?? null, dates: school.dates }]
      : [],
  );
}

type BackgroundCardProps = {
  entity: ExaPersonEntity | null;
  highlights: string[];
  linkedinProfile: LinkedInProfile | null;
  resolution: Resolution | null;
};

function BackgroundCard({ entity, highlights, linkedinProfile, resolution }: BackgroundCardProps) {
  const [expanded, setExpanded] = useState(false);
  const allRoles = rolesFrom(entity, linkedinProfile);
  const allSchools = schoolsFrom(entity, linkedinProfile);
  const roles = expanded ? allRoles : allRoles.slice(0, MAX_ROLES);
  const schools = expanded ? allSchools : allSchools.slice(0, MAX_SCHOOLS);
  const research = entity?.properties.research;
  const headline = linkedinProfile?.headline ?? null;
  const summary = linkedinProfile?.summary ?? null;
  const followers = linkedinProfile?.followersCount ?? null;
  const allSkills = linkedinProfile?.skills ?? [];
  const skills = expanded ? allSkills : allSkills.slice(0, MAX_SKILLS);
  const languages = linkedinProfile?.languages ?? [];
  const canExpand =
    !!summary ||
    allRoles.some((role) => role.description) ||
    allRoles.length > MAX_ROLES ||
    allSchools.length > MAX_SCHOOLS ||
    allSkills.length > MAX_SKILLS;

  if (
    !resolution &&
    !linkedinProfile &&
    roles.length === 0 &&
    schools.length === 0 &&
    highlights.length === 0 &&
    !research
  ) {
    return null;
  }

  return (
    <SectionCard>
      <SectionHead>
        Background
        {canExpand && (
          <Toggle type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? "Show less" : "Show more"}
          </Toggle>
        )}
      </SectionHead>
      <SectionBody>
        {resolution && <ProfileMatch resolution={resolution} />}
        {(headline || followers != null) && (
          <Group>
            {headline && <Headline>{headline}</Headline>}
            {followers != null && <Followers>{followers.toLocaleString("en-GB")} LinkedIn followers</Followers>}
          </Group>
        )}
        {summary && (
          <Group>
            <Eyebrow>About</Eyebrow>
            <Body data-clamp={expanded ? undefined : 4}>{summary}</Body>
          </Group>
        )}
        {roles.length > 0 && (
          <Group>
            <Eyebrow>Career</Eyebrow>
            {roles.map((role, index) => (
              <Item key={index}>
                <ItemRow>
                  <ItemMain>
                    <ItemTitle>{role.title ?? "Role"}</ItemTitle>
                    {role.company && <ItemSub>{role.company}</ItemSub>}
                  </ItemMain>
                  <ItemDates>{formatDates(role.dates)}</ItemDates>
                </ItemRow>
                {role.description && <Body data-clamp={expanded ? undefined : 2}>{role.description}</Body>}
              </Item>
            ))}
          </Group>
        )}
        {schools.length > 0 && (
          <Group>
            <Eyebrow>Education</Eyebrow>
            {schools.map((school, index) => (
              <ItemRow key={index}>
                <ItemMain>
                  <ItemTitle>{school.name}</ItemTitle>
                  {school.detail && <ItemSub>{school.detail}</ItemSub>}
                </ItemMain>
                <ItemDates>{formatDates(school.dates)}</ItemDates>
              </ItemRow>
            ))}
          </Group>
        )}
        {skills.length > 0 && (
          <Group>
            <Eyebrow>Skills</Eyebrow>
            <Chips>
              {skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
              {!expanded && allSkills.length > MAX_SKILLS && <More>+{allSkills.length - MAX_SKILLS}</More>}
            </Chips>
          </Group>
        )}
        {languages.length > 0 && (
          <Group>
            <Eyebrow>Languages</Eyebrow>
            <Stats>{languages.join(", ")}</Stats>
          </Group>
        )}
        {research && (research.hIndex || research.citationCount) && (
          <Group>
            <Eyebrow>Research</Eyebrow>
            <Stats>
              {research.hIndex != null && <span>h-index {research.hIndex}</span>}
              {research.citationCount != null && <span>{research.citationCount.toLocaleString("en-GB")} citations</span>}
              {research.worksCount != null && <span>{research.worksCount} works</span>}
            </Stats>
          </Group>
        )}
        {highlights.length > 0 && (
          <Group>
            <Eyebrow>Highlights</Eyebrow>
            <Highlights>
              {highlights.slice(0, 4).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </Highlights>
          </Group>
        )}
      </SectionBody>
    </SectionCard>
  );
}

export default BackgroundCard;

const Group = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const Item = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const ItemRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
});

const ItemMain = styled.div({
  minWidth: 0,
});

const ItemTitle = styled.div(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const ItemSub = styled.div(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
}));

const ItemDates = styled.span(({ theme }) => ({
  flexShrink: 0,
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));

const Stats = styled.div(({ theme }) => ({
  display: "flex",
  gap: 12,
  fontSize: 13,
  color: theme.textSecondary,
}));

const Highlights = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  paddingLeft: 16,
  fontSize: 12,
  lineHeight: 1.5,
  color: theme.textSecondary,
}));

const Toggle = styled.button(({ theme }) => ({
  all: "unset",
  fontSize: 12,
  fontWeight: 400,
  color: theme.textTertiary,
  cursor: "pointer",
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, borderRadius: 4 },
}));

const Headline = styled.p(({ theme }) => ({
  fontSize: 13,
  lineHeight: 1.5,
  color: theme.textPrimary,
}));

const Followers = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));

const Body = styled.p(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1.55,
  color: theme.textSecondary,
  whiteSpace: "pre-line",
  overflowWrap: "anywhere",
  "&[data-clamp]": {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  "&[data-clamp='2']": { WebkitLineClamp: 2 },
  "&[data-clamp='4']": { WebkitLineClamp: 4 },
}));

const Chips = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
});

const Chip = styled.span(({ theme }) => ({
  padding: "2px 7px",
  borderRadius: 9999,
  fontSize: 11,
  color: theme.textSecondary,
  backgroundColor: theme.surface200,
}));

const More = styled.span(({ theme }) => ({
  padding: "2px 4px",
  fontSize: 11,
  color: theme.textTertiary,
}));

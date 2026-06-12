import ServicePage from '../components/ServicePage';

export default function Infrastructure() {
  return (
    <ServicePage
      pageKey="infrastructure"
      accentColor="infra"
      ctaGradient="from-infra-dark via-infra to-infra-light"
      ctaTextColor="text-infra-dark"
    />
  );
}

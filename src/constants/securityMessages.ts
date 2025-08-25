export const SECURITY_MESSAGES = {
  en: {
    unitedStates: {
      message: 'United States - Standard Security Precautions',
      details: 'The United States maintains high security standards. Follow standard travel precautions as you would in any developed country. No specific security alerts are currently active.'
    }
  },
  es: {
    unitedStates: {
      message: 'Estados Unidos - Precauciones de Seguridad Estándar',
      details: 'Estados Unidos mantiene altos estándares de seguridad. Sigue las precauciones de viaje estándar como lo harías en cualquier país desarrollado. No hay alertas de seguridad específicas activas actualmente.'
    }
  },
  fr: {
    unitedStates: {
      message: 'États-Unis - Précautions de Sécurité Standard',
      details: 'Les États-Unis maintiennent des normes de sécurité élevées. Suivez les précautions de voyage standard comme vous le feriez dans n\'importe quel pays développé. Aucune alerte de sécurité spécifique n\'est actuellement active.'
    }
  }
};

export const getSecurityMessage = (locale: string, key: string) => {
  const messages = SECURITY_MESSAGES[locale as keyof typeof SECURITY_MESSAGES] || SECURITY_MESSAGES.en;
  return messages[key as keyof typeof messages] || messages.unitedStates;
};

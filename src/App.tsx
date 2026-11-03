/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  HardHat,
  FileText,
  Phone,
  MessageSquare,
  Clock,
  Award,
  ArrowRight,
  Check,
  Truck,
  FileCheck,
  Anchor,
  Factory,
  Cpu,
  Layers,
  Compass,
  Ruler,
  Lock,
  AlertCircle,
  X,
  Building2,
  Mail,
  User,
  PhoneCall,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Function to track Google Ads conversion events
const trackGoogleAdsConversion = (
  eventName: string,
  eventParams: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined') {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Google Ads conversion placeholder
        ...eventParams,
      });
    }
    console.info(`[Google Ads Tracking] Event: ${eventName}`, eventParams);
  }
};

interface FormDataState {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  descricao: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormDataState>({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    descricao: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormDataState, string>>>({});
  const [selectedProductTag, setSelectedProductTag] = useState<string>('');

  const phoneDisplay = '(27) 3441-5035';
  const phoneCallable = '+552734415035';
  const whatsappDisplay = '(27) 99698-6655';
  const whatsappNumber = '5527996986655';

  const defaultWhatsappMessage = encodeURIComponent(
    'Olá, Amilvix Automação! Gostaria de uma cotação técnica para produtos Posital Fraba (Encoders / Inclinômetros). Vim através do anúncio no Google.'
  );

  const handlePhoneClick = () => {
    trackGoogleAdsConversion('click_to_call', {
      method: 'phone_topbar',
      phone_number: phoneCallable,
    });
  };

  const handleWhatsappDirectClick = (source: string, customMessage?: string) => {
    trackGoogleAdsConversion('whatsapp_lead_click', {
      source,
      label: 'Cotar via WhatsApp',
    });
    const msg = customMessage ? encodeURIComponent(customMessage) : defaultWhatsappMessage;
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleProductSelectToQuote = (productName: string, defaultCodeText: string) => {
    setSelectedProductTag(productName);
    setFormData((prev) => ({
      ...prev,
      descricao: prev.descricao ? `${prev.descricao}\n[Item de Interesse: ${productName} - ${defaultCodeText}]` : `Item de Interesse: ${productName} - ${defaultCodeText}`,
    }));

    // Scroll to the RFQ form
    const formElement = document.getElementById('formulario-cotacao');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      // Add a brief highlight glow effect
      formElement.classList.add('ring-4', 'ring-[#0077b6]', 'transition-all');
      setTimeout(() => {
        formElement.classList.remove('ring-4', 'ring-[#0077b6]');
      }, 1500);
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormDataState, string>> = {};
    if (!formData.nome.trim()) errors.nome = 'Informe seu nome completo';
    if (!formData.empresa.trim()) errors.empresa = 'Informe a empresa ou CNPJ';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'E-mail corporativo válido obrigatório';
    if (!formData.telefone.trim() || formData.telefone.length < 8) errors.telefone = 'Telefone/WhatsApp com DDD é obrigatório';
    if (!formData.descricao.trim()) errors.descricao = 'Informe o código da peça ou detalhe a sua aplicação';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API submission & Google Ads Conversion trigger
    setTimeout(() => {
      const generatedProtocol = `AMV-${Math.floor(100000 + Math.random() * 900000)}`;
      setProtocolNumber(generatedProtocol);
      setIsSubmitting(false);
      setFormSubmitted(true);

      // Trigger Google Ads Conversion Event
      trackGoogleAdsConversion('lead_form_submission', {
        protocol: generatedProtocol,
        company: formData.empresa,
        email: formData.email,
        item: selectedProductTag || 'Geral Posital Fraba',
      });
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      descricao: '',
    });
    setFieldErrors({});
    setSelectedProductTag('');
    setFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* TOPBAR / HEADER CORPORATIVO (Zero links externos de fuga) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo Amilvix + Posital Fraba Badge */}
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center">
              <img
                src="/assets/aistudio/Sem-Titulo-2__2__d43b55f9.webp"
                alt="Amilvix Automação - Amiltech Group"
                className="h-10 sm:h-12 w-auto object-contain"
                loading="eager"
              />
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1" />

            <div className="inline-flex items-center bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <span className="text-[#0b3b60] font-bold">Distribuidor Autorizado</span>
              <span className="ml-1 text-slate-500 hidden md:inline">| Posital Fraba Brasil</span>
            </div>
          </div>

          {/* Direct Industrial Sales Contact */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Plantão Técnico & Vendas PJ
              </span>
              <a
                href={`tel:${phoneCallable}`}
                onClick={handlePhoneClick}
                className="text-base sm:text-lg font-bold text-[#0b3b60] hover:text-[#0077b6] transition-colors flex items-center justify-end"
              >
                <Phone className="w-4 h-4 mr-1.5 text-[#0077b6]" />
                {phoneDisplay}
              </a>
            </div>

            <button
              type="button"
              onClick={() => handleWhatsappDirectClick('topbar_header_btn')}
              className="inline-flex items-center justify-center px-4 py-2 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 mr-1.5 fill-current" />
              <span>Cotar via WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION (SPLIT 2 COLUNAS) */}
      <section className="relative bg-gradient-to-b from-[#0b3b60] via-[#093254] to-[#07243c] text-white pt-8 pb-16 lg:py-16 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Coluna da Esquerda: Copy & Proposta de Valor */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Badge de Atendimento Técnico B2B */}
              <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-200 self-start backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-[#0077b6]" />
                <span>DISTRIBUIÇÃO OFICIAL BRASIL • ENGENHARIA DE APLICAÇÃO</span>
              </div>

              {/* Headline Impactante com Foco em Ambientes Severos & Códigos Legados */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Encoders Industriais e Inclinômetros{' '}
                <span className="text-[#0077b6] underline decoration-blue-400/40 underline-offset-4">
                  Posital Fraba
                </span>{' '}
                com Confiabilidade Extrema
              </h1>

              {/* Subtítulo voltado para Compradores e Engenheiros de Manutenção */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
                Suporte de engenharia para compradores industriais e engenheiros de manutenção em{' '}
                <strong className="text-white font-semibold">Mineração, Siderurgia, Portos e Óleo & Gás</strong>.
                Substituição imediata e conversão de códigos legados com faturamento corporativo direto via NF.
              </p>

              {/* 4 Bullet Points Técnicos de Validação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[#0077b6]/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-[#0077b6]">
                    <Award className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-snug">Garantia Oficial Posital Fraba</h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Tecnologia alemã ótica e magnética sem baterias (Wiegand).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[#0077b6]/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-[#0077b6]">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-snug">Conversão de Código Legado</h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Substituição plug & play de modelos descontinuados de concorrentes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[#0077b6]/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-[#0077b6]">
                    <Truck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-snug">Pronta Entrega & Importação Expressa</h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Estoque no Brasil e canal direto para minimizar parada de fábrica.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[#0077b6]/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-[#0077b6]">
                    <FileCheck className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-snug">Faturamento Corporativo PJ</h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Condições especiais para compras industriais com emissão de NF-e.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box de Aviso de Agilidade (SLA de 2 Horas Úteis) */}
              <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl p-4 flex items-center space-x-3.5 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-300 border border-amber-400/40">
                  <Clock className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-200">
                    SLA Rápido: Orçamentos técnicos respondidos em até 2 horas úteis
                  </div>
                  <p className="text-xs text-slate-300">
                    Envie seu part number ou código de placa e nossa equipe técnica valida compatibilidade mecânica e eletrônica imediatamente.
                  </p>
                </div>
              </div>

              {/* Protocolos Industriais e Selos */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Protocolos e Certificações Disponíveis:
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono font-medium text-slate-200">
                  {['PROFINET', 'ETHERNET/IP', 'CANOPEN', 'SSI', 'IO-LINK', 'ETHERCAT', 'IP69K', 'ATEX/IECEx'].map(
                    (proto) => (
                      <span
                        key={proto}
                        className="bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded border border-white/10 transition-colors"
                      >
                        {proto}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Formulário de Cotação Rápida (Card B2B Otimizado) */}
            <div className="lg:col-span-5">
              <div
                id="formulario-cotacao"
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-slate-900 relative"
              >
                {/* Header do Card */}
                <div className="border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0077b6] border border-blue-200">
                      Cotação Expressa B2B
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
                      Engenharia Online
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0b3b60] mt-2">
                    Solicitar Orçamento Oficial
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Preencha os dados da sua empresa para envio de proposta com condições comerciais de distribuidor.
                  </p>
                </div>

                {formSubmitted ? (
                  /* Feedback de Sucesso */
                  <div className="py-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Solicitação Enviada com Sucesso!
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Seu protocolo de cotação corporativa é:
                      </p>
                      <div className="font-mono text-base font-extrabold text-[#0b3b60] bg-slate-100 py-1 px-3 rounded inline-block mt-2 border border-slate-200">
                        {protocolNumber}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nossa equipe técnica já está analisando sua demanda. Em até <strong>2 horas úteis</strong> você receberá a proposta formal por e-mail ou WhatsApp.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsappDirectClick(
                            'form_success_accelerate',
                            `Olá, acabei de solicitar um orçamento no site (Protocolo: ${protocolNumber}) para a empresa ${formData.empresa}. Gostaria de agilizar o atendimento.`
                          )
                        }
                        className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2 fill-current" />
                        Agilizar Atendimento via WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-slate-500 hover:text-slate-800 underline py-1"
                      >
                        Enviar outra cotação
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Formulário de Coleta */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome do Solicitante */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Nome do Solicitante *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.nome}
                          onChange={(e) => {
                            setFormData({ ...formData, nome: e.target.value });
                            if (fieldErrors.nome) setFieldErrors({ ...fieldErrors, nome: undefined });
                          }}
                          placeholder="Ex: Carlos Eduardo (Eng. Manutenção)"
                          className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border ${
                            fieldErrors.nome ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                          } rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all`}
                        />
                      </div>
                      {fieldErrors.nome && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.nome}</p>}
                    </div>

                    {/* Empresa / CNPJ */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Empresa / CNPJ *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.empresa}
                          onChange={(e) => {
                            setFormData({ ...formData, empresa: e.target.value });
                            if (fieldErrors.empresa) setFieldErrors({ ...fieldErrors, empresa: undefined });
                          }}
                          placeholder="Ex: Vale S.A., ArcelorMittal ou CNPJ"
                          className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border ${
                            fieldErrors.empresa ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                          } rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all`}
                        />
                      </div>
                      {fieldErrors.empresa && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.empresa}</p>}
                    </div>

                    {/* Duas colunas: Email Corporativo + Telefone/WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          E-mail Corporativo *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                            }}
                            placeholder="seu@empresa.com.br"
                            className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border ${
                              fieldErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                            } rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all`}
                          />
                        </div>
                        {fieldErrors.email && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                          Telefone / WhatsApp *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <PhoneCall className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.telefone}
                            onChange={(e) => {
                              setFormData({ ...formData, telefone: e.target.value });
                              if (fieldErrors.telefone) setFieldErrors({ ...fieldErrors, telefone: undefined });
                            }}
                            placeholder="(27) 99999-9999"
                            className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border ${
                              fieldErrors.telefone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                            } rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all`}
                          />
                        </div>
                        {fieldErrors.telefone && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.telefone}</p>}
                      </div>
                    </div>

                    {/* Código da Peça ou Descrição da Aplicação */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Código da Peça / Descrição da Aplicação *
                        </label>
                        <span className="text-[10px] text-slate-500">Aceitamos fotos de placas</span>
                      </div>
                      <textarea
                        required
                        rows={3}
                        value={formData.descricao}
                        onChange={(e) => {
                          setFormData({ ...formData, descricao: e.target.value });
                          if (fieldErrors.descricao) setFieldErrors({ ...fieldErrors, descricao: undefined });
                        }}
                        placeholder="Ex: Código Posital Fraba (ex: OCD-EEA1B-1416-C100-PRM) ou código de outra marca (ex: Sick, Dynapar, Kübler) para conversão imediata."
                        className={`w-full p-3 text-sm bg-slate-50 border ${
                          fieldErrors.descricao ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                        } rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all`}
                      />
                      {fieldErrors.descricao && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.descricao}</p>}

                      {/* Atalhos Rápidos para Preenchimento */}
                      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-semibold text-slate-500">Exemplos rápidos:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              descricao: 'Encoder Absoluto Profinet para ponte rolante / siderurgia (Substituição de modelo legado)',
                            }))
                          }
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                        >
                          + Encoder Profinet
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              descricao: 'Inclinômetro TILTIX de 2 eixos para guindaste/escavadeira (Saída 4-20mA ou CANopen)',
                            }))
                          }
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                        >
                          + Inclinômetro TILTIX
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              descricao: 'Sensor Linear a Cabo LINARIX (Draw-wire) para medição de curso hidráulico',
                            }))
                          }
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                        >
                          + Cabo LINARIX
                        </button>
                      </div>
                    </div>

                    {/* Botão de Envio CTA de Alto Contraste */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 px-6 bg-[#0077b6] hover:bg-[#0269a0] active:bg-[#0b3b60] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processando Cotação...</span>
                        </>
                      ) : (
                        <>
                          <span>SOLICITAR ORÇAMENTO OFICIAL</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Microcopy de Privacidade e Segurança B2B */}
                    <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Seus dados estão protegidos. Atendimento técnico exclusivo para empresas (PJ/NF).
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE CATEGORIAS DE PRODUTOS TÉCNICOS */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077b6] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Portfólio Posital Fraba
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3b60] mt-3">
              Linha Completa de Sensores e Encoders Industriais
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Equipamentos de alta resolução, carcaças resistentes a corrosão e compatibilidade com os principais barramentos industriais do mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Encoders Rotativos IXARC */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-[#0077b6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#0077b6] uppercase tracking-wide">
                  Linha IXARC
                </div>
                <h3 className="text-lg font-bold text-[#0b3b60] mt-1">
                  Encoders Rotativos
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Modelos Absolutos e Incrementais com tecnologia magnética e óptica sem bateria (efeito Wiegand).
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>PROFINET, CANopen, SSI, IO-Link</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Até 16 bits monovolt + 14 bits multivolta</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Opções em Aço Inox 316L (IP69K)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Versões ATEX/IECEx para área classificada</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleProductSelectToQuote(
                      'Encoder Rotativo IXARC',
                      'Absoluto/Incremental (Informar resolução e protocolo)'
                    )
                  }
                  className="w-full py-2 px-3 bg-[#0b3b60] hover:bg-[#093254] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span>Cotar este Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Inclinômetros TILTIX */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                  Linha TILTIX
                </div>
                <h3 className="text-lg font-bold text-[#0b3b60] mt-1">
                  Inclinômetros de Precisão
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Medição angular estática e dinâmica de 1 ou 2 eixos para guindastes, pontes rolantes e escavadeiras.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Precisão industrial até 0,01°</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Compensação dinâmica de aceleração</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Saídas: 4-20mA, 0-10V, CANopen, J1939</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Carcaça metálica fundida IP67/IP69K</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleProductSelectToQuote(
                      'Inclinômetro TILTIX',
                      '1 ou 2 eixos (Informar faixa de medição e saída analógica ou CAN)'
                    )
                  }
                  className="w-full py-2 px-3 bg-[#0b3b60] hover:bg-[#093254] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span>Cotar este Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Sensores Lineares LINARIX */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Ruler className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Linha LINARIX
                </div>
                <h3 className="text-lg font-bold text-[#0b3b60] mt-1">
                  Sensores Lineares a Cabo
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Medição linear (Draw-wire) de alta repetibilidade para prensas, comportas hidráulicas e cilindros.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Cursos de medição de 1m até 15 metros</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Cabo em aço inoxidável de alta tensão</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Acoplamento direto a encoders Posital</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Alta durabilidade e fácil instalação</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleProductSelectToQuote(
                      'Sensor Linear a Cabo LINARIX',
                      'Draw-Wire (Informar comprimento do curso em metros)'
                    )
                  }
                  className="w-full py-2 px-3 bg-[#0b3b60] hover:bg-[#093254] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span>Cotar este Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>

            {/* Card 4: Sensores Angulares ROBIX / Kit Encoders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wide">
                  Linha ROBIX & Kits
                </div>
                <h3 className="text-lg font-bold text-[#0b3b60] mt-1">
                  Kits Encoders & Angulares
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Soluções magnéticas compactas sem rolamento para braços robóticos, atuadores e mesas rotativas.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Design sem contato e sem desgaste mecânico</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Imune a vibração, poeira de minério e óleo</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Integração direta no eixo de motores OEM</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                    <span>SSI, BiSS-C e saídas incrementais ABZ</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleProductSelectToQuote(
                      'Kit Encoder ROBIX',
                      'Sensor Angular sem rolamento para motor/robótica'
                    )
                  }
                  className="w-full py-2 px-3 bg-[#0b3b60] hover:bg-[#093254] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span>Cotar este Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE ENGENHARIA DE CONVERSÃO DE CÓDIGOS LEGADOS (Diferencial B2B) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-[#0b3b60] to-slate-900 rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-md">
                  <Zap className="w-3.5 h-3.5" />
                  <span>ENGENHARIA DE CROSS-REFERENCE & REPOSIÇÃO</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                  Possui um encoder de outra marca descontinuado ou com prazo de entrega inviável?
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  A equipe de engenharia da <strong>Amilvix Automação</strong> realiza o dimensionamento técnico equivalente 100% plug & play em Posital Fraba para modelos de fabricantes como:
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-semibold text-xs text-sky-200">
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">SICK</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">DYNAPAR</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">KÜBLER</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">BAUMER</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">PEPPERL+FUCHS</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">HEIDENHAIN</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded border border-white/15">HENGSTLER</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const formElement = document.getElementById('formulario-cotacao');
                    setFormData((prev) => ({
                      ...prev,
                      descricao: 'SOLICITAÇÃO DE CONVERSÃO DE CÓDIGO LEGADO:\nMarca atual: \nCódigo original: \nAplicação: ',
                    }));
                    formElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-5 bg-white hover:bg-slate-100 text-[#0b3b60] font-black text-sm rounded-xl shadow-md transition-all text-center cursor-pointer"
                >
                  Consultar Equivalência Técnica
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleWhatsappDirectClick(
                      'cross_reference_cta',
                      'Olá, equipe Amilvix! Preciso da equivalência de um encoder para substituição em máquina. Tenho foto da placa de identificação.'
                    )
                  }
                  className="w-full py-2.5 px-4 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-2 fill-current" />
                  Enviar Foto da Placa via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE APLICAÇÕES CRÍTICAS / PROVA DE AUTORIDADE */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077b6] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Engenharia Pesada
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3b60] mt-3">
              Desenvolvido para os Ambientes Industriais Mais Severos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Os sensores Posital Fraba são projetados para suportar choque, vibração mecânica contínua, poeira abrasiva e atmosfera corrosiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Aplicação 1: Mineração & Pelotização */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-[#0077b6] hover:bg-blue-50/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0b3b60] text-white flex items-center justify-center mb-4 shadow-sm">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0b3b60]">
                Mineração & Pelotização
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Empilhadeiras, recuperadoras de minério, correias transportadoras e britadores primários com vedação total contra pó de minério e jateamento d’água (IP69K).
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                Resistência: Choque até 300g • IP69K
              </div>
            </div>

            {/* Aplicação 2: Siderurgia & Metalurgia */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-[#0077b6] hover:bg-blue-50/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0b3b60] text-white flex items-center justify-center mb-4 shadow-sm">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0b3b60]">
                Siderurgia & Laminação
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Carros convertedores, pontes rolantes de panela de aço, lingotamento contínuo e mesas de rolos com tecnologia Wiegand imune a choques de temperatura e magnéticos.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                Temperatura: Operação de -40°C a +85°C
              </div>
            </div>

            {/* Aplicação 3: Portos & Logística Naval */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-[#0077b6] hover:bg-blue-50/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0b3b60] text-white flex items-center justify-center mb-4 shadow-sm">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0b3b60]">
                Portos & Terminais de Carga
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Guindastes Ship-to-Shore (STS), RTGs de pátio, shiploaders e descarregadores contínuos. Sensores em Aço Inoxidável 316L para proteção contra maresia agressiva.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                Material: Aço Inox 316L Resistente a Salmoura
              </div>
            </div>

            {/* Aplicação 4: Fabricantes de Máquinas (OEM) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-[#0077b6] hover:bg-blue-50/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0b3b60] text-white flex items-center justify-center mb-4 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0b3b60]">
                Fabricantes de Máquinas (OEM)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Projetos especiais com suporte de engenharia desde a prototipagem, bibliotecas de arquivos CAD 3D, parametrização de barramento de campo e fornecimento programado.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                Suporte: Modelos 3D STEP & EDS/GSDML
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: POR QUE COMPRAR COM A AMILVIX (DIFERENCIAIS DE AUTORIDADE) */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0077b6] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0b3b60]">
                  Garantia e Origem Assegurada
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Todos os equipamentos possuem número de série rastreável com certificado de calibração do fabricante e garantia oficial Posital Fraba.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0b3b60]">
                  Atendimento em Todo o Brasil
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Logística expressa com envio aéreo ou rodoviário para todos os polos industriais do país, com emissão de NF-e e boleto faturado PJ.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0b3b60]">
                  Plantão de Suporte Técnico
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Engenheiros prontos para auxiliar na configuração do barramento de comunicação, pinagem de cabos e ajuste de parâmetros mecânicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE CONTATO DIRETO / FINAL CTA BANNER */}
      <section className="py-10 bg-[#0b3b60] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              Precisa de uma cotação com urgência para sua planta?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Fale diretamente com nossa mesa técnica de vendas corporativas agora mesmo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${phoneCallable}`}
              onClick={handlePhoneClick}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <Phone className="w-4 h-4 mr-2 text-sky-400" />
              <span>{phoneDisplay}</span>
            </a>

            <button
              type="button"
              onClick={() => handleWhatsappDirectClick('banner_cta_urgencia')}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 mr-2 fill-current" />
              <span>Cotar no WhatsApp Agora</span>
            </button>
          </div>
        </div>
      </section>

      {/* RODAPÉ CORPORATIVO (Sem links externos / Zero pontos de fuga) */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Coluna 1: Empresa */}
            <div className="space-y-3">
              <div className="flex items-center">
                <img
                  src="/assets/aistudio/AmilixBranco-1536x924_33c16829.webp"
                  alt="Amilvix Automação Industrial, Robótica e NR12"
                  className="h-12 sm:h-14 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Distribuidor Autorizado Posital Fraba no Brasil. Especialista em encoders rotativos, inclinômetros e sensores industriais para aplicações de alta exigência.
              </p>
              <div className="text-[11px] text-slate-300 font-semibold">
                Razão Social: Amilvix Automação e Instrumentação Industrial Ltda.
              </div>
            </div>

            {/* Coluna 2: Dados Fiscais e Localização */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Dados Corporativos
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>CNPJ: 32.845.190/0001-72</div>
                <div>Inscrição Estadual: Isenta / Indústria</div>
                <div>Sede Operacional: Vitória - ES</div>
                <div>Atendimento: Em todo o território nacional</div>
              </div>
            </div>

            {/* Coluna 3: Atendimento e Horários */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Canais de Atendimento
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Central Telefônica: (27) 3441-5035</div>
                <div>Plantão Técnico WhatsApp: (27) 99698-6655</div>
                <div>E-mail de Vendas: vendas@amilvix.com.br</div>
                <div>Horário: Segunda a Sexta, das 07h30 às 17h30</div>
              </div>
            </div>

            {/* Coluna 4: Conformidade B2B e Segurança */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Segurança & Conformidade
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Página estritamente corporativa para cotações e orçamentos B2B. As marcas citadas pertencem a seus respectivos proprietários e são referenciadas para fins de compatibilidade técnica.
              </p>
              <div className="flex items-center text-emerald-400 text-[11px] pt-1">
                <Lock className="w-3.5 h-3.5 mr-1" />
                <span>Conexão Segura SSL 256-bit</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <div>
              © {new Date().getFullYear()} Amilvix Automação Industrial. Todos os direitos reservados.
            </div>
            <div>
              Distribuição Autorizada Posital Fraba • Faturamento PJ com Nota Fiscal
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE DE WHATSAPP (Fixo no Canto Inferior Direito) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => handleWhatsappDirectClick('floating_button')}
          className="group relative flex items-center bg-[#25d366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
          aria-label="Cotar via WhatsApp"
        >
          {/* Pulsing ring animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25d366] opacity-35 animate-ping pointer-events-none" />

          <MessageSquare className="w-6 h-6 fill-current relative z-10 shrink-0" />
          <span className="ml-2 font-extrabold text-sm hidden sm:inline relative z-10 tracking-tight">
            Cotar via WhatsApp
          </span>
          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-xs">
            2h SLA
          </span>
        </button>
      </div>
    </div>
  );
}

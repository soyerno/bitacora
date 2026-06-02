# 00 · El JSM de MODO

> Objetivo: entendés qué es el JSM, para qué sirve cada portal y cuándo abrís un ticket en vez de hacer un PR o mandarle un mensaje a alguien.

## ¿Qué es el JSM de MODO?

El **Jira Service Management (JSM)** de Play Digital es el sistema de tickets para pedidos internos: accesos, hardware, software, Cyber/IAM, OFFSEC, Rendición de Gastos, Legal, y más. Vivís en `https://play-sistemico.atlassian.net/servicedesk/customer/portals`.

No es el mismo Jira donde van las tareas de desarrollo (COENXT, EXA, etc.). Acá no hay sprints ni epics — hay **pedidos** que siguen un flujo de aprobación y tienen SLA.

## Los 29 service desks

Cada "portal" es un service desk con sus formularios. Los más relevantes para un dev MODO:

| Código | Nombre | sd | Forms | Cuándo |
|--------|--------|----|-------|--------|
| HD | IT-Solicitudes | 1 | 47 | Accesos generales, hardware, software, GitHub repo ABM |
| CYBS | Cyber · Solicitudes IAM | 24 | 100 | GitHub teams, AWS, Amplitude, 1Password, Datadog, Google |
| ACR | Cyber · GRC Solicitudes | 126 | 5 | Autoevaluaciones, auditorías |
| OFFSEC | Cyber · Offensive Security | 192 | 6 | Pentesting, Threat Modeling, GRC Hub |
| CSMYR | Cyber · Monitoreo y Respuesta | 225 | 7 | Análisis phishing, USB exceptions, SIEM |
| DSOSH | DSO Security Hub | 6 | 17 | DevSecOps findings, AWS Security Hub |
| PEA | Platform-Assistant | 23 | 2 | Investigar problemas de plataforma |
| RDG | Rendición de Gastos | 8 | 15 | Capacitaciones, viáticos, tarjeta corporativa |
| FIN | Finance | 14 | 8 | FP&A, PAYROLL, reintegros |
| LEGOPS | Legal Ops | 159 | 5 | Consultas legales, documentación de promo |
| LT | LCA-TRUST | 27 | 6 | Operaciones desconocidas, robo de celular |
| PEOP | People · Compensaciones | 13 | 3 | Beneficios, sueldo |
| NFSC | Infosec | 20 | 1 | Gestión de identidades |
| IH | Infosec-HD | 17 | 3 | Incidentes de seguridad |

> El total del catálogo (snapshot 2026-05-21): 29 service desks · 318 request types. Algunos desks son de prueba o internos (TS, AAA, ITDMS) — no abrís tickets ahí.

## Las 318 formas de pedirte algo

Dentro de cada service desk hay **request types** — los formularios concretos. Cada uno tiene:

- Un **nombre** legible (ej. "Github - Agregar Usuario a Team").
- Un **sd** (service desk id) y **rt** (request type id). Esos dos números son el contrato con la API.
- Un schema de **campos** (algunos requeridos, algunos opcionales), que varía por form y no podés asumir.

Ejemplo:

```
"Github - Agregar Usuario a Team"   →  sd=24  rt=1577
"ABM de Repositorios de GitHub"     →  sd=1   rt=1404
"Cyber & GRC Hub"                   →  sd=192 rt=14111
"1Password"                         →  sd=24  rt=1042
```

## Cuándo abrís ticket vs otras acciones

| Situación | Acción |
|-----------|--------|
| Necesitás acceso a una herramienta (GitHub, Datadog, AWS...) | Ticket en CYBS o HD |
| Querés que creen/borren/modifiquen un repo de GitHub | Ticket HD, rt=1404 (ABM de Repos) |
| Querés agregar alguien a un GitHub team | Ticket CYBS, rt=1577 |
| Querés crear un GitHub team nuevo | Ticket CYBS, rt=1576 |
| Bug en código → PR | PR en el repo, no ticket |
| Tarea de desarrollo planificada | Issue en COENXT/EXA |
| Incidente de seguridad urgente | IH · sd=17 · rt=217 (Submit request or incident) |
| Necesitás un pentest o threat modeling | OFFSEC · sd=192 |
| Problema con plataforma interna | PEA · sd=23 · rt=10936 |
| Querés reportar gasto | RDG · sd=8 |

> **Regla práctica**: si necesitás que alguien de IT/Cyber/Infra haga algo en un sistema externo al código, es un ticket JSM. Si es trabajo en el código, es un issue Jira o PR.

## ¿Cómo entrás al portal?

```
https://play-sistemico.atlassian.net/servicedesk/customer/portals
```

Autenticás con Google SSO (`@modo.com.ar`). Si no ves algún portal, es porque no sos customer de ese service desk todavía — el equipo de IT lo puede habilitar.

---

> Siguiente: [01 · Descubrir el portal](01-descubrir-portal.md)

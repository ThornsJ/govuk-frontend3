# Phase tag

Phase tags are mostly used inside phase banners as an indication of the state of a project. It’s possible to use them outside phase banners, for example as part of a service header.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Phase tag [demo](phase-tag.html).

## Usage

Code example(s)

```
@@include('phase-tag.html')
```
## Nunjucks

```
{% from "phase-tag/macro.njk" import govukPhaseTag %}

{{ govukPhaseTag(phaseTagText='Alpha') }}
```

## Arguments

| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| phaseTagText      | string  |         | Yes       | Tag text
| classes           | string  |         | No        | Optional additional classes

<!--
## Installation

```
npm install --save @govuk-frontend/phase-tag
```
-->

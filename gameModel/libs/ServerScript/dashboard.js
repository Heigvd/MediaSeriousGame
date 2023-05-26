/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013-2021  School of Management and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */


var MediaGameDashboards = (function () {
    "use strict";
    var Long = Java.type("java.lang.Long");

    // Wegas-level variables (use their "Script alias")
    var CURRENT_PHASE = "phaseMSG",
        NB_ETAPES = "phaseMax",
        CAISSE = "caisse",
        DEPENSES = "depensesMensuelles",
        TEMPS = "timeCards",
        HISTORY = "history";

    function questionAnswered(teamId, currentPhaseInstance, currentPeriod) {
        var currentPhase = currentPhaseInstance.getValue();
        currentPeriod = currentPeriod || 1;

        if (Variable.find(gameModel, 'questions').size() < currentPhase) {
            return "0/0";
        }
        var q = Variable.find(gameModel, 'questions').item(currentPhase - 1),
            i = 0, items = new java.util.LinkedList(), questions, item, inst, count = 0, total = 0;
        if (q) {
            for (i = 0; i < q.size(); i += 1) {
                item = q.item(i);
                if (item instanceof com.wegas.mcq.persistence.QuestionDescriptor) {
                    items.add(item);
                } else if (i === currentPeriod - 1 &&
                    item instanceof com.wegas.core.persistence.variable.ListDescriptor) {
                    items.addAll(item.flatten());
                }
            }
        }

        for (i = 0; i < items.length; i += 1) {
            inst = Variable.getInstancesByKeyId(items[i])[teamId];
            if (inst instanceof com.wegas.mcq.persistence.QuestionInstance) {
                count += (inst.getReplies().size() > 0 && inst.getActive()) ? 1 : 0;
                total += inst.getActive() ? 1 : 0;
            }
        }
        return count + "/" + total;

    }

// Gauge formatter function:
    var formatRed = function (value) {
		return "<span class='dashboard-" + (value > 0 ? "red" : "white") + "'>" + value + "</span>"
    },
        formatGreen = function (value) {
			return "" + value;
            bloc.one(".bloc__value")
                .setStyle("background-color", (value > 0 ? "#4caf50" : "white"))
                .setStyle("color", (value > 0 ? "white" : "black"))
                .setStyle("font-weight", (value > 0 ? "bold" : "normal"))
                .setStyle("border-radius", "2px");
        },
        formatRedIfZero = function (value) {
			return "" + value;
            bloc.one(".bloc__value")
                .setStyle("background-color", (value === 0 ? "#ff4a03" : "white"))
                .setStyle("color", (value === 0 ? "white" : "black"))
                .setStyle("font-weight", (value === 0 ? "bold" : "normal"))
                .setStyle("border-radius", "2px");
        };

    WegasDashboard.registerVariable(CURRENT_PHASE, {
        label: "Etape",
        mapFn: function (teamId, currentPhase, nbEtapes) {
            return currentPhase.getValue() + "&thinsp;/&thinsp;" + nbEtapes.getValue();
        },
        mapFnExtraArgs: [NB_ETAPES]
    });

    WegasDashboard.registerVariable(CURRENT_PHASE, {
        id: "actions",
        label: "Actions",
        sortable: true,
        mapFn: questionAnswered,
        mapFnExtraArgs: [NB_ETAPES]
    });

    WegasDashboard.registerVariable(CAISSE, {
        formatter: formatGreen,
        label: "Liquidités"
    });
    WegasDashboard.registerVariable(DEPENSES, {
        label: "Dépenses",
        formatter: formatRed
    });
    WegasDashboard.registerVariable(TEMPS, {
        label: "Budget Temps",
        formatter: formatRedIfZero
    });
    WegasDashboard.registerVariable(HISTORY);

    WegasDashboard.registerAction("sendmail", function (team, payload) {
        new Y.Wegas.ImpactsTeamModal({
            "team": team,
            "customImpacts": [
                ["Send Mail inside Simulation",
                    'PMGHelper.sendMessage(${"type":"string", "view": {"label":"From"}}, ${"type":"string", "view": {"label":"Subject"}}, ${"type": "string", "view": {"label":"Body", "type": "html", "required":true}}, []);'],
            ],
            "showAdvancedImpacts": false
        }).render();
    }, {
        section: "impacts",
        hasGlobal: true,
        icon: "fa fa-envelope-o",
        label: "Send Mail inside Simulation"
    });

    WegasDashboard.registerAction("impacts", function (team, payload) {
        new Y.Wegas.ImpactsTeamModal({
            "team": team,
            "customImpacts": [
                ["Ajouter un nombre à une variable",
                    'Variable.find(gameModel, "timeCards").add(self, ${"type":"number", "view": {"label":"' + I18n.t(Y.Wegas.Facade.Variable.cache.find("name", "timeCards").get("label")) + '"}});'
                        + 'Variable.find(gameModel, "caisse").add(self, ${"type":"number", "view": {"label": "' + I18n.t(Y.Wegas.Facade.Variable.cache.find("name", "caisse").get("label")) + '"}});'
                        + 'Variable.find(gameModel, "depensesMensuelles").add(self, ${"type":"number", "view": {"label": "' + I18n.t(Y.Wegas.Facade.Variable.cache.find("name", "depensesMensuelles").get("label")) + '"}});']
            ],
            "showAdvancedImpacts": true
        }).render();
    }, {
        section: "impacts",
        hasGlobal: true,
        icon: "fa fa-pencil",
        label: "Add to project variables"
    });

})();
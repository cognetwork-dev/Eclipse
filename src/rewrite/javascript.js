import { parseScript } from "meriyah";
import { generate } from "astring";
import rewrite from "./index.js"

function javascript(code) {
    try {
        var AST = parseScript(code, {
            module: true,
            webcompat: true,
            globalReturn: true
        })
    } catch {
        var AST = parseScript("")
    }

    AST.body = walk(AST.body)

    function rewriteNode(node, parentNode) {   
        if (!node) {
            return node;
        }

        if (node.type === "Literal" && (parentNode.type === "ImportDeclaration" || parentNode.type === "ExportNamedDeclaration" || parentNode.type === "ExportAllDeclaration")) {
            node.value = rewrite.url(node.value);
        }

        var windows = ["window", "top", "document", "this"]

        if (node.type == "ThisExpression") {
            node = {
                "type": "Identifier",
                "name": "this"
            }
        }
        
        if (node.type == "Identifier" && windows.includes(node.name) &&  parentNode && parentNode.type !== "FunctionDeclaration" && parentNode.type !== "CallExpression") {
            let oldParent = structuredClone ? structuredClone(parentNode) : JSON.parse(JSON.stringify(parentNode))
            node.name = "$ec.window(" + node.name + ")"

            if (parentNode && parentNode.type == "VariableDeclarator") {
                parentNode.id.name = oldParent.id.name
            }

            if (parentNode && parentNode.type == "AssignmentExpression" || parentNode.type == "AssignmentPattern") {
                parentNode.left.name = oldParent.left.name
            }
        }

        if (node.type == "Identifier" && node.name == "location" && parentNode.type !== "FunctionDeclaration" && parentNode.type !== "CallExpression") {
            let oldParent = structuredClone ? structuredClone(parentNode) : JSON.parse(JSON.stringify(parentNode))
            node.name = "$ec.window(this)." + node.name

            if (parentNode && parentNode.type == "VariableDeclarator") {
                parentNode.id.name = oldParent.id.name
            }

            if (parentNode && parentNode.type == "AssignmentExpression" || parentNode.type == "AssignmentPattern") {
                parentNode.left.name = oldParent.left.name
            }
        }

        return node;
    }

    function walk(nodes, parentNode) {
    nodes = rewriteNode(nodes, parentNode)
    for (let node in nodes) {
        if (nodes[node] instanceof Array) {
            for (let n in nodes[node]) {
                walk(nodes[node][n], nodes[node])
            }
        } else {
            if (nodes[node] instanceof Object) {
                walk(nodes[node], nodes)
            }
        }
    }

    return nodes;
    }

    //They are working on a compact option...
    var result = generate(AST)

    return result;
}

export { javascript as default };
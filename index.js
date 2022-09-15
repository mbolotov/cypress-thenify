const { parse } = require('@babel/parser');

const innerVariable = '__cypressSyncVar__';
const thenifyName = "thenify";


module.exports = function plugin({types}) {
  let expName

  function processCyExpression(statement, path, cyExprNodePath) {
    const cyexpr = cyExprNodePath.node

    const nextNodes = statement.getAllNextSiblings().map(n => n.node);
    const newNode = statement.getSource().replace(path.getSource(), innerVariable)
    const parsedNode = parse(newNode)
    nextNodes.unshift(parsedNode.program.body[0])
    const body = types.blockStatement(nextNodes)


    const param = types.identifier(innerVariable)
    const callback = types.arrowFunctionExpression([param], body)
    const member = types.memberExpression(cyexpr, types.identifier("then"))
    cyExprNodePath.replaceWith(types.identifier(innerVariable))

    const full = types.expressionStatement(types.callExpression(member, [callback]))
    statement.replaceWith(full)

    statement.getAllNextSiblings().forEach(s => s.remove())
  }

  return {
    name: 'cyThenify',
    visitor: {
      Identifier: {
        exit(path, state) {
          if (state.opts.total_thenify !== 'true') return

          if (path.node.name !== 'cy') return
          if (path.node.start === undefined) return  // do not process newly added cy expressions

          const statement = path.getStatementParent();
          if (!statement) return

          if (types.isVariableDeclaration(statement)) {
            let callExpr = path.find(p => types.isCallExpression(p) && types.isVariableDeclarator(p.parentPath))
            if (callExpr != null) {
              processCyExpression(statement, callExpr, callExpr)
              return
            }
          }

          const nextNodes = statement.getAllNextSiblings().map(n => n.node);
          const body = types.blockStatement(nextNodes)

          const callback = types.arrowFunctionExpression([], body)
          const member = types.memberExpression(types.identifier('cy'), types.identifier("then"))
          const full = types.expressionStatement(types.callExpression(member, [callback]))
          statement.insertAfter(full)
          const allNextSiblings = statement.getAllNextSiblings();
          allNextSiblings.shift()
          allNextSiblings.forEach(s => s.remove())
        }
      },

      CallExpression: {
        exit(path, state) {
          const callee = path.node.callee
          const property = callee.property;
          if (!property) return
          const funName = property.name;
          if (!funName) return

          if (!expName) {
            expName = state.opts.thenify_function_name || thenifyName
          }

          if (funName !== expName) return

          const statement = path.getStatementParent()
          if (!statement) return

          processCyExpression(statement, path, path.get("callee").get("object"));
        }
      },
    }
  }
}

const { parse } = require('@babel/parser');

const innerVariable = '__cypressSyncVar__';
const thenifyName = "thenify";


module.exports = function plugin({types}) {
  let expName
  return {
    name: 'cyThenify',
    visitor: {
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

          const cyexprNodePath = path.get("callee").get("object")
          const cyexpr = cyexprNodePath.node

          const statement = path.getStatementParent()
          if (!statement) return

          const nextNodes = statement.getAllNextSiblings().map(n => n.node);
          const newNode = statement.getSource().replace(path.getSource(), innerVariable)
          const parsedNode = parse(newNode)
          nextNodes.unshift(parsedNode.program.body[0])
          const body = types.blockStatement(nextNodes)


          const param = types.identifier(innerVariable)
          const callback = types.arrowFunctionExpression([param], body)
          const member = types.memberExpression(cyexpr, types.identifier("then"))
          cyexprNodePath.replaceWith(types.identifier(innerVariable))

          const full = types.expressionStatement(types.callExpression(member, [callback]))
          statement.replaceWith(full)

          statement.getAllNextSiblings().forEach(s => s.remove())
        }
      },
    }
  }
}
